import { extractTimeRange } from '@/lib/utils';

describe('extractTimeRange', () => {
    it('should return an empty array for invalid start time', () => {
        expect(extractTimeRange('invalid' as any, '1 hour')).toEqual(new Set());
    });

    it('should return an empty array for invalid duration', () => {
        expect(extractTimeRange('08:00', 'invalid' as any)).toEqual(new Set());
    });

    it('should return correct time range for valid inputs', () => {
        expect(extractTimeRange('10:00', '1 hour')).toEqual(new Set([600, 615, 630, 645, 660]));
    });

    it('should return correct time range for  night to morning values', () => {
        expect(extractTimeRange('23:30', '1½ hours')).toEqual(new Set([1410, 1425, 0, 15, 30, 45, 60]));
    });

    it('should return correct time range for valid inputs', () => {
        const result = extractTimeRange('08:00', '1 hour');
        expect(result).toEqual(new Set([480, 495, 510, 525, 540]));
    });

    it('should handle step parameter correctly', () => {
        const result = extractTimeRange('08:00', '1 hour', 30);
        expect(result).toEqual(new Set([480, 510, 540]));
    });
});
