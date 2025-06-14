import { Request, Response } from "express";
import moment from "moment-timezone";

export async function getTimeZone(req: Request, res: Response) {
    
    try {
        const timezones = moment.tz.names();
        res.status(200).json({
            status: 'OK',
            data: timezones,
            message: 'Get List Data successfully',
        });
    } catch (error: any) {
        console.error('error:', error);
        res.status(500).json({
            status: 'ERROR',
            data: null,
            message: error.message,
        });
    }
}