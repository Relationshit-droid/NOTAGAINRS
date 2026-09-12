const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Dr. Marcie's overlay animations ship as .webm / .mp4 and the game screens
// reference audio assets; Metro must treat these as bundled assets.
const mediaExts = ['webm', 'mp4', 'mov', 'm4a', 'mp3', 'wav'];
config.resolver.assetExts = Array.from(new Set([...config.resolver.assetExts, ...mediaExts]));

module.exports = config;
