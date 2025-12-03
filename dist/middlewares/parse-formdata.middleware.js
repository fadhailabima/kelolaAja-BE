"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormDataBody = void 0;
/**
 * Middleware to parse FormData body fields
 * Converts string numbers to actual numbers for validation
 */
function parseFormDataBody(req, res, next) {
    console.log('[parseFormDataBody] Middleware started');
    console.log('[parseFormDataBody] req.body keys:', Object.keys(req.body || {}));
    console.log('[parseFormDataBody] req.body:', JSON.stringify(req.body, null, 2));
    
    // Only process if body exists and has form data fields
    if (req.body && typeof req.body === 'object') {
        // Fields that should be converted to numbers
        const numberFields = ['jobId', 'yearsOfExperience', 'expectedSalary', 'cvFileId'];
        
        // Convert string numbers to actual numbers
        numberFields.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
                const originalValue = req.body[field];
                const originalType = typeof originalValue;
                
                // Try to convert to number
                if (typeof originalValue === 'string') {
                    const trimmedValue = originalValue.trim();
                    if (trimmedValue !== '') {
                        const numValue = Number(trimmedValue);
                        // Only convert if it's a valid number
                        if (!isNaN(numValue) && isFinite(numValue)) {
                            req.body[field] = numValue;
                            console.log(`[parseFormDataBody] Converted ${field}: "${originalValue}" (${originalType}) -> ${numValue} (number)`);
                        } else {
                            console.log(`[parseFormDataBody] Failed to convert ${field}: "${originalValue}" is not a valid number`);
                        }
                    }
                } else {
                    console.log(`[parseFormDataBody] ${field} is already ${originalType}:`, originalValue);
                }
            }
        });
        
        // Remove empty string fields (convert to undefined for optional fields)
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] === '' && !numberFields.includes(key)) {
                // Keep required fields, remove optional empty strings
                if (key !== 'applicantName' && key !== 'applicantEmail' && key !== 'applicantPhone') {
                    delete req.body[key];
                }
            }
        });
        
        console.log('[parseFormDataBody] After conversion:');
        console.log('[parseFormDataBody] jobId:', req.body.jobId, typeof req.body.jobId);
        console.log('[parseFormDataBody] yearsOfExperience:', req.body.yearsOfExperience, typeof req.body.yearsOfExperience);
        console.log('[parseFormDataBody] expectedSalary:', req.body.expectedSalary, typeof req.body.expectedSalary);
    } else {
        console.log('[parseFormDataBody] No body found or body is not an object');
    }
    
    next();
}
exports.parseFormDataBody = parseFormDataBody;
//# sourceMappingURL=parse-formdata.middleware.js.map

