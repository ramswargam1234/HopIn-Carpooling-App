import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight Google Places Autocomplete input.
 * Loads the Google Maps JS script once and exposes { place_id, description }.
 *
 * Props:
 *   value: current text
 *   onChange: (textValue) => void
 *   onSelect: ({ place_id, description }) => void
 *   placeholder
 */
let scriptPromise = null;
function loadGoogleMaps(apiKey) {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve();
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export default function PlaceAutocomplete({ value, onChange, onSelect, placeholder }) {
  const inputRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return;
    loadGoogleMaps(key).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'formatted_address', 'name'],
    });
    ac.addListener('place_changed', () => {
      const p = ac.getPlace();
      if (p?.place_id) {
        const description = p.formatted_address || p.name;
        onChange(description);
        onSelect({ place_id: p.place_id, description });
      }
    });
  }, [ready]);

  return (
    <input
      ref={inputRef}
      className="w-full border p-2 rounded"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
