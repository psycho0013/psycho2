import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Loader2, Hospital, Pill, HeartPulse, X, Phone, Clock, ExternalLink, ChevronDown, LocateFixed, AlertCircle, Layers, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════
interface POI {
    id: number;
    lat: number;
    lon: number;
    name: string;
    type: 'hospital' | 'pharmacy' | 'clinic';
    phone?: string;
    website?: string;
    opening_hours?: string;
    address?: string;
    operator?: string;
}

type FilterType = 'all' | 'hospital' | 'pharmacy' | 'clinic';

// ═══════════════════════════════════════════════════════════════════════════
// Custom Marker Icons (SVG-based, no external images needed)
// ═══════════════════════════════════════════════════════════════════════════
const createIcon = (color: string, emoji: string) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="
        width: 40px; height: 40px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px ${color}60;
        position: relative;
    "><span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">${emoji}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42],
});

const ICONS = {
    hospital: createIcon('#ef4444', '🏥'),
    pharmacy: createIcon('#10b981', '💊'),
    clinic: createIcon('#3b82f6', '🩺'),
    user: L.divIcon({
        className: 'user-marker',
        html: `<div style="
            width: 20px; height: 20px;
            background: #3b82f6;
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 4px 12px rgba(0,0,0,0.2);
            animation: pulse-ring 1.5s ease-out infinite;
        "></div>
        <style>
            @keyframes pulse-ring {
                0% { box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 4px 12px rgba(0,0,0,0.2); }
                100% { box-shadow: 0 0 0 16px rgba(59,130,246,0), 0 4px 12px rgba(0,0,0,0.1); }
            }
        </style>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    }),
};

// ═══════════════════════════════════════════════════════════════════════════
// Overpass API Fetcher
// ═══════════════════════════════════════════════════════════════════════════
const fetchPOIs = async (bounds: L.LatLngBounds): Promise<POI[]> => {
    const s = bounds.getSouth();
    const w = bounds.getWest();
    const n = bounds.getNorth();
    const e = bounds.getEast();

    const query = `
        [out:json][timeout:25];
        (
            nwr["amenity"~"^(hospital|pharmacy|clinic)$"](${s},${w},${n},${e});
        );
        out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok) throw new Error('Overpass API error');
    const data = await response.json();

    return data.elements
        .map((el: any) => {
            const lat = el.lat || el.center?.lat;
            const lon = el.lon || el.center?.lon;
            if (!lat || !lon) return null;

            const tags = el.tags || {};
            const amenity = tags.amenity as POI['type'];

            return {
                id: el.id,
                lat,
                lon,
                name: tags['name:ar'] || tags.name || (amenity === 'hospital' ? 'مستشفى' : amenity === 'pharmacy' ? 'صيدلية' : 'مركز صحي'),
                type: amenity,
                phone: tags.phone || tags['contact:phone'],
                website: tags.website || tags['contact:website'],
                opening_hours: tags.opening_hours,
                address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join('، '),
                operator: tags.operator,
            } as POI;
        })
        .filter(Boolean) as POI[];
};

// ═══════════════════════════════════════════════════════════════════════════
// Map Event Handler Component
// ═══════════════════════════════════════════════════════════════════════════
const MapEventHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
    const map = useMapEvents({
        moveend: () => onBoundsChange(map.getBounds()),
        zoomend: () => onBoundsChange(map.getBounds()),
    });

    useEffect(() => {
        // Initial bounds on mount
        onBoundsChange(map.getBounds());
    }, []);

    return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// Fly-To Helper Component
// ═══════════════════════════════════════════════════════════════════════════
const FlyToLocation = ({ position }: { position: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════
const MedicalDirectory = () => {
    const navigate = useNavigate();
    const [pois, setPois] = useState<POI[]>([]);
    const [filtered, setFiltered] = useState<POI[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
    const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [showList, setShowList] = useState(false);

    // Default: center of Iraq (Baghdad)
    const defaultCenter: [number, number] = [33.3, 44.37];
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Request user location
    const requestLocation = useCallback(() => {
        setLocationError(null);
        if (!navigator.geolocation) {
            setLocationError('المتصفح لا يدعم خدمة الموقع');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(loc);
                setFlyTo(loc);
            },
            (err) => {
                console.error('Location error:', err);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setLocationError('يرجى السماح بالوصول إلى موقعك من إعدادات المتصفح');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setLocationError('معلومات الموقع غير متوفرة حالياً');
                        break;
                    default:
                        setLocationError('حدث خطأ في تحديد موقعك');
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
        );
    }, []);

    // Request location on mount
    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    // Fetch POIs when map bounds change (debounced)
    const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchPOIs(bounds);
                setPois(data);
            } catch (err) {
                console.error('Error fetching POIs:', err);
            } finally {
                setLoading(false);
            }
        }, 800);
    }, []);

    // Filter POIs
    useEffect(() => {
        if (filter === 'all') {
            setFiltered(pois);
        } else {
            setFiltered(pois.filter(p => p.type === filter));
        }
    }, [pois, filter]);

    // Stats
    const stats = {
        hospital: pois.filter(p => p.type === 'hospital').length,
        pharmacy: pois.filter(p => p.type === 'pharmacy').length,
        clinic: pois.filter(p => p.type === 'clinic').length,
    };

    const filterButtons: { key: FilterType; label: string; icon: typeof Hospital; color: string; count: number }[] = [
        { key: 'all', label: 'الكل', icon: Layers, color: 'bg-slate-600', count: pois.length },
        { key: 'hospital', label: 'مستشفيات', icon: Hospital, color: 'bg-red-500', count: stats.hospital },
        { key: 'pharmacy', label: 'صيدليات', icon: Pill, color: 'bg-emerald-500', count: stats.pharmacy },
        { key: 'clinic', label: 'مراكز صحية', icon: HeartPulse, color: 'bg-blue-500', count: stats.clinic },
    ];

    const getTypeLabel = (type: POI['type']) => {
        switch (type) {
            case 'hospital': return 'مستشفى';
            case 'pharmacy': return 'صيدلية';
            case 'clinic': return 'مركز صحي';
        }
    };

    const getTypeColor = (type: POI['type']) => {
        switch (type) {
            case 'hospital': return 'text-red-600 bg-red-50 border-red-200';
            case 'pharmacy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'clinic': return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const openInGoogleMaps = (poi: POI) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lon}`, '_blank');
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-100" style={{ zIndex: 1 }}>

            {/* ═══════ Top Bar ═══════ */}
            <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shrink-0 safe-area-top z-20 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <MapPin size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-800 leading-tight">الدليل الطبي</h1>
                            <p className="text-[10px] text-slate-400 font-medium">مستشفيات • صيدليات • مراكز صحية</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full">
                                <Loader2 size={14} className="animate-spin" />
                                <span className="hidden sm:inline">جاري البحث...</span>
                            </div>
                        )}

                        {/* Locate Me Button */}
                        <button
                            onClick={requestLocation}
                            className="p-2.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-600 rounded-xl transition-all active:scale-95"
                            title="حدد موقعي"
                        >
                            <LocateFixed size={18} />
                        </button>

                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95"
                            title="رجوع"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" dir="rtl">
                    {filterButtons.map(fb => (
                        <button
                            key={fb.key}
                            onClick={() => setFilter(fb.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${
                                filter === fb.key
                                    ? `${fb.color} text-white border-transparent shadow-lg`
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <fb.icon size={14} />
                            {fb.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                filter === fb.key ? 'bg-white/25' : 'bg-slate-100'
                            }`}>
                                {fb.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════ Location Error ═══════ */}
            <AnimatePresence>
                {locationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-3 text-amber-700 text-sm font-medium shrink-0 z-20"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        <span className="flex-1 text-xs">{locationError}</span>
                        <button onClick={() => setLocationError(null)} className="p-1 hover:bg-amber-100 rounded-lg">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════ Map ═══════ */}
            <div className="flex-1 relative z-10">
                <MapContainer
                    center={userLocation || defaultCenter}
                    zoom={userLocation ? 14 : 7}
                    className="w-full h-full"
                    zoomControl={false}
                    attributionControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                        maxZoom={19}
                    />
                    <MapEventHandler onBoundsChange={handleBoundsChange} />
                    <FlyToLocation position={flyTo} />

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker position={userLocation} icon={ICONS.user}>
                            <Popup>
                                <div className="text-center font-bold text-sm" dir="rtl">📍 موقعك الحالي</div>
                            </Popup>
                        </Marker>
                    )}

                    {/* POI Markers */}
                    {filtered.map(poi => (
                        <Marker
                            key={poi.id}
                            position={[poi.lat, poi.lon]}
                            icon={ICONS[poi.type]}
                            eventHandlers={{
                                click: () => setSelectedPOI(poi),
                            }}
                        />
                    ))}
                </MapContainer>

                {/* ═══════ Floating List Toggle ═══════ */}
                <button
                    onClick={() => setShowList(!showList)}
                    className="absolute bottom-24 md:bottom-6 left-4 z-20 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2 border border-slate-200 active:scale-95 transition-transform"
                >
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${showList ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-bold text-slate-700">{filtered.length} نتيجة</span>
                </button>
            </div>

            {/* ═══════ Bottom Sheet (List View) ═══════ */}
            <AnimatePresence>
                {showList && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[55vh] flex flex-col safe-area-bottom"
                    >
                        {/* Handle */}
                        <div className="flex justify-center py-3 shrink-0">
                            <div className="w-10 h-1 bg-slate-300 rounded-full" />
                        </div>

                        <div className="px-4 pb-2 flex items-center justify-between shrink-0">
                            <h3 className="font-bold text-slate-800">الأماكن القريبة ({filtered.length})</h3>
                            <button onClick={() => setShowList(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                            {filtered.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-bold">لا توجد نتائج في هذه المنطقة</p>
                                    <p className="text-xs mt-1">حاول تحريك الخريطة أو تكبيرها</p>
                                </div>
                            ) : (
                                filtered.map(poi => (
                                    <button
                                        key={poi.id}
                                        onClick={() => {
                                            setSelectedPOI(poi);
                                            setFlyTo([poi.lat, poi.lon]);
                                            setShowList(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-right border border-slate-100"
                                    >
                                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg border ${getTypeColor(poi.type)}`}>
                                            {poi.type === 'hospital' ? '🏥' : poi.type === 'pharmacy' ? '💊' : '🩺'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-800 truncate">{poi.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{getTypeLabel(poi.type)} {poi.address && `• ${poi.address}`}</p>
                                        </div>
                                        <Navigation size={16} className="text-primary shrink-0 rotate-45" />
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════ Selected POI Detail Card ═══════ */}
            <AnimatePresence>
                {selectedPOI && !showList && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0.2 }}
                        className="absolute bottom-24 md:bottom-6 left-4 right-4 z-30 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden safe-area-bottom"
                    >
                        <div className="p-5">
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl border ${getTypeColor(selectedPOI.type)}`}>
                                    {selectedPOI.type === 'hospital' ? '🏥' : selectedPOI.type === 'pharmacy' ? '💊' : '🩺'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{selectedPOI.name}</h3>
                                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mt-1 border ${getTypeColor(selectedPOI.type)}`}>
                                        {getTypeLabel(selectedPOI.type)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedPOI(null)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                                >
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Info Rows */}
                            <div className="space-y-2.5 mb-5">
                                {selectedPOI.address && (
                                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                        <MapPin size={15} className="text-slate-400 shrink-0" />
                                        <span>{selectedPOI.address}</span>
                                    </div>
                                )}
                                {selectedPOI.phone && (
                                    <a href={`tel:${selectedPOI.phone}`} className="flex items-center gap-2.5 text-sm text-primary font-medium">
                                        <Phone size={15} className="shrink-0" />
                                        <span dir="ltr">{selectedPOI.phone}</span>
                                    </a>
                                )}
                                {selectedPOI.opening_hours && (
                                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                        <Clock size={15} className="text-slate-400 shrink-0" />
                                        <span dir="ltr" className="text-xs">{selectedPOI.opening_hours}</span>
                                    </div>
                                )}
                                {selectedPOI.operator && (
                                    <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                        <Hospital size={15} className="text-slate-400 shrink-0" />
                                        <span>{selectedPOI.operator}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => openInGoogleMaps(selectedPOI)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-blue-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                                >
                                    <Navigation size={16} className="rotate-45" />
                                    اتجاهات
                                </button>
                                {selectedPOI.phone && (
                                    <a
                                        href={`tel:${selectedPOI.phone}`}
                                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
                                    >
                                        <Phone size={16} />
                                        اتصال
                                    </a>
                                )}
                                {selectedPOI.website && (
                                    <a
                                        href={selectedPOI.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-slate-100 text-slate-600 px-4 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicalDirectory;
