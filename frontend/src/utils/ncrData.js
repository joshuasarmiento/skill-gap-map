// src/utils/ncrData.js
export const NCR_DISTRICT_CONFIG = {
  'NCR, City of Manila, First District (Not a Province)': [
    'manila-city-metro-manila'
  ],
  'NCR, Second District (Not a Province)': [
    'mandaluyong-city-metro-manila', 
    'pasig-city-metro-manila', 
    'quezon-city-metro-manila', 
    'marikina-city-metro-manila', 
    'san-juan-city-metro-manila'
  ],
  'NCR, Third District (Not a Province)': [
    'caloocan-city-metro-manila', 
    'malabon-city-metro-manila', 
    'navotas-city-metro-manila', 
    'valenzuela-city-metro-manila'
  ],
  'NCR, Fourth District (Not a Province)': [
    'makati-city-metro-manila', 
    'pasay-city-metro-manila', 
    'taguig-city-metro-manila', 
    'paranaque-city-metro-manila', 
    'las-pinas-city-metro-manila', 
    'muntinlupa-city-metro-manila',
    'pateros-Metro-Manila'
  ]
};

// Helper to find which district a specific city belongs to
export const getDistrictByCitySlug = (citySlug) => {
  return Object.keys(NCR_DISTRICT_CONFIG).find(district => 
    NCR_DISTRICT_CONFIG[district].includes(citySlug)
  ) || citySlug; 
};