'use client';

import { useState } from 'react';

type Persona = { id: string; nombre: string; apellidos: string };

export function SelectorPersona({
  personas,
  personaInicial,
}: {
  personas: Persona[];
  personaInicial?: string;
}) {
  const [modo, setModo] = useState<'existente' | 'nueva'>('existente');

  return (
    <div>
      <label className="block text-sm text-gray-700">Donante *</label>

      <div className="mt-1 mb-2 flex gap-4 text-xs text-torat-moshe-gray">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={modo === 'existente'}
            onChange={() => setModo('existente')}
          />
          Congregante existente
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={modo === 'nueva'} onChange={() => setModo('nueva')} />
          Escribir nombre nuevo
        </label>
      </div>

      {modo === 'existente' ? (
        <select
          name="persona_id"
          required
          defaultValue={personaInicial ?? ''}
          className="w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
        >
          <option value="" disabled>
            Selecciona…
          </option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellidos}
            </option>
          ))}
        </select>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <input
            name="nombre_nuevo_donante"
            required={modo === 'nueva'}
            placeholder="Nombre"
            className="rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
          <input
            name="apellidos_nuevo_donante"
            required={modo === 'nueva'}
            placeholder="Apellidos"
            className="rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>
      )}
      {modo === 'nueva' && (
        <p className="mt-1 text-xs text-torat-moshe-gray">
          Se creará como nuevo congregante al guardar la donación.
        </p>
      )}
    </div>
  );
}
