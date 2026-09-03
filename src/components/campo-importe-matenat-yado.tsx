'use client';

import { useState } from 'react';

export function CampoImporteConMatenatYado({
  montoInicial,
  monedaInicial,
  matenatYadoInicial,
}: {
  montoInicial?: string;
  monedaInicial?: string;
  matenatYadoInicial?: boolean;
}) {
  const [esMatenatYado, setEsMatenatYado] = useState(matenatYadoInicial ?? false);
  const [monto, setMonto] = useState(montoInicial ?? '');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700">Importe *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="monto"
          required
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-torat-moshe-gray">
          <input
            type="checkbox"
            name="es_matenat_yado"
            checked={esMatenatYado}
            onChange={(e) => {
              setEsMatenatYado(e.target.checked);
              if (e.target.checked) setMonto('1');
            }}
          />
          Matenat Yado (importe simbólico, se ajusta al cobrar)
        </label>
      </div>
      <div>
        <label className="block text-sm text-gray-700">Moneda</label>
        <input
          name="moneda"
          defaultValue={monedaInicial ?? 'EUR'}
          className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
        />
      </div>
    </div>
  );
}
