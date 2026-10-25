/**
 * ============================================================================
 * AUTOTRACK PRO - BACKEND DE PERSISTENCIA PARA GOOGLE SITES (GOOGLE APPS SCRIPT)
 * ============================================================================
 *
 * INSTRUCCIONES DE INSTALACIÓN (1 MINUTO):
 * 1. Abre Google Drive y crea una Hoja de cálculo de Google nueva (Google Sheets).
 * 2. En el menú superior, ve a: Extensiones > Apps Script.
 * 3. Borra el código que aparece por defecto y pega todo este archivo.
 * 4. Haz clic en el ícono de Guardar (💾) arriba.
 * 5. Haz clic en el botón azul "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 6. En "Selecciona el tipo" (⚙️), elige "Aplicación web" (Web App).
 * 7. Configura estos 2 campos:
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone) -> Necesario para que el iframe de Google Sites pueda leer/guardar sin bloqueo CORS.
 * 8. Haz clic en "Implementar", autoriza los permisos si te lo pide, y copia la "URL de la aplicación web" (termina en /exec).
 * 9. Pega esa URL en la pestaña "Nube & Backup" de AutoTrack (o en la constante DEFAULT_CLOUD_SYNC_URL del HTML).
 */

const PROP_KEY = 'AUTOTRACK_STATE_JSON';

function doGet(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const raw = props.getProperty(PROP_KEY);
    const data = raw ? JSON.parse(raw) : null;

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        data: data,
        updatedAt: props.getProperty('AUTOTRACK_UPDATED_AT') || null
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!contents) {
      throw new Error('No se recibieron datos en el cuerpo de la petición.');
    }

    const parsed = JSON.parse(contents);
    const payload = parsed.data ? parsed.data : parsed;
    const nowIso = new Date().toISOString();

    // 1. Guardar JSON completo en PropertiesService (rápido y atómico)
    const props = PropertiesService.getScriptProperties();
    props.setProperty(PROP_KEY, JSON.stringify(payload));
    props.setProperty('AUTOTRACK_UPDATED_AT', nowIso);

    // 2. Sincronizar tablas legibles en la Hoja de Cálculo (si el script está vinculado a un Google Sheet)
    try {
      syncToSpreadsheet(payload);
    } catch (sheetErr) {
      // Si el script se creó suelto sin Google Sheet, igual funciona con PropertiesService
      console.warn('No se sincronizó con hoja de cálculo:', sheetErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        updatedAt: nowIso
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function syncToSpreadsheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss || !data) return;

  // Hoja Resumen / Vehículo
  let shVeh = ss.getSheetByName('Vehiculo') || ss.insertSheet('Vehiculo');
  shVeh.clearContents();
  const v = data.vehicle || {};
  shVeh.getRange(1, 1, 5, 2).setValues([
    ['Campo', 'Valor'],
    ['Marca y Modelo', v.model || ''],
    ['Año', v.year || ''],
    ['Patente', v.plate || ''],
    ['Unidad Consumo', v.unit || 'kml']
  ]);

  // Hoja Recorridos / Trips
  let shTrips = ss.getSheetByName('Recorridos') || ss.insertSheet('Recorridos');
  shTrips.clearContents();
  const tripRows = [['ID', 'Fecha', 'Km Inicial', 'Km Final', 'Distancia (km)', 'Motivo', 'Trayecto', 'Notas']];
  (data.trips || []).forEach(t => {
    tripRows.push([t.id || '', t.date || '', t.startKm || '', t.endKm || '', t.distance || '', t.purpose || '', t.route || '', t.notes || '']);
  });
  shTrips.getRange(1, 1, tripRows.length, tripRows[0].length).setValues(tripRows);

  // Hoja Mantenimiento
  let shServ = ss.getSheetByName('Mantenimiento') || ss.insertSheet('Mantenimiento');
  shServ.clearContents();
  const servRows = [['ID', 'Fecha', 'Kilometraje', 'Tipo', 'Taller', 'Costo', 'Próximo Km', 'Próxima Fecha', 'Notas']];
  (data.service || []).forEach(s => {
    servRows.push([s.id || '', s.date || '', s.km || '', s.type || '', s.workshop || '', s.cost || 0, s.nextKm || '', s.nextDate || '', s.notes || '']);
  });
  shServ.getRange(1, 1, servRows.length, servRows[0].length).setValues(servRows);

  // Hoja Averías
  let shIss = ss.getSheetByName('Averias') || ss.insertSheet('Averias');
  shIss.clearContents();
  const issRows = [['ID', 'Fecha Detección', 'Estado', 'Problema', 'Costo', 'Fecha Solución', 'Notas']];
  (data.issues || []).forEach(i => {
    issRows.push([i.id || '', i.date || '', i.status || '', i.title || '', i.cost || 0, i.resolvedDate || '', i.notes || '']);
  });
  shIss.getRange(1, 1, issRows.length, issRows[0].length).setValues(issRows);

  // Hoja Combustible
  let shFuel = ss.getSheetByName('Combustible') || ss.insertSheet('Combustible');
  shFuel.clearContents();
  const fuelRows = [['ID', 'Fecha', 'Kilometraje', 'Litros', 'Costo', 'Tipo', 'Estación', 'Tanque Lleno', 'Notas']];
  (data.fuel || []).forEach(f => {
    fuelRows.push([f.id || '', f.date || '', f.km || '', f.liters || 0, f.cost || 0, f.type || '', f.station || '', f.fullTank ? 'Sí' : 'No', f.notes || '']);
  });
  shFuel.getRange(1, 1, fuelRows.length, fuelRows[0].length).setValues(fuelRows);

  // Hoja Gastos
  let shExp = ss.getSheetByName('Gastos') || ss.insertSheet('Gastos');
  shExp.clearContents();
  const expRows = [['ID', 'Fecha Pago', 'Categoría', 'Monto', 'Vencimiento', 'Detalle']];
  (data.expenses || []).forEach(x => {
    expRows.push([x.id || '', x.date || '', x.cat || '', x.amount || 0, x.dueDate || '', x.detail || '']);
  });
  shExp.getRange(1, 1, expRows.length, expRows[0].length).setValues(expRows);
}
