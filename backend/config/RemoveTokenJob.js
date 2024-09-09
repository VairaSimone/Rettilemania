import cron from 'node-cron';
import RevokedToken from './models/RevokedToken.js';

// Esegui ogni giorno a mezzanotte
cron.schedule('0 0 * * *', async () => {
    try {
        // Elimina i token scaduti
        await RevokedToken.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log('Token revocati scaduti eliminati');
    } catch (error) {
        console.error('Errore durante la pulizia dei token revocati:', error);
    }
});
