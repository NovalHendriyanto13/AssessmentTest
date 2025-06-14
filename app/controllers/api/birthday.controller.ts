import { Request, Response } from "express";
import { BirthdayRequest, BirthdayInterface } from "../../interfaces/birthday.interface";
import { UserModel } from "../../models/users.model";
import { sendEmail } from "../../services/common.service";

export async function list(req: Request, res: Response) {
    try {
        const data = await UserModel
            .find();

        res.status(200).json({
            status: 'OK',
            data,
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

export async function create(req: Request<{}, {}, BirthdayRequest>, res: Response) {
   
    try {
        const data = new UserModel(req.body);
        await data.save();

        res.status(200).json({
            status: 'OK',
            data,
            message: 'Insert data is successfully',
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

export async function detail(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const data: any = await UserModel.findById(id);

        res.status(200).json({
            status: 'OK',
            data,
            message: 'Get Detail Data is successfully',
        });
    } catch (error: any) {
        console.error('error:', error);
        res.status(500).json({
            status: 'ERROR',
            data: null,
            message: "",
        });
    }
}

export async function update(req: any, res: any) {
    const payload = req.body;
    const { id } = req.params;
    try {
        const data: any = await UserModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });

        if (!data) {
            return res.status(404).json({
                status: 'ERROR',
                data: null,
                message: 'User not found' 
            });
        }

        res.status(200).json({
            status: 'OK',
            data,
            message: 'Update data is successfully',
        });
    } catch (error: any) {
        console.error('error:', error);
        res.status(500).json({
            status: 'ERROR',
            data: null,
            message: "",
        });
    }
}

export async function remove(req: any, res: any) {
    const { id } = req.params;
    try {
        const data: any = await UserModel.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                status: 'ERROR',
                data: null,
                message: 'User not found' 
            });
        }

        res.status(200).json({
            status: 'OK',
            data,
            message: 'Delete data is successfully',
        });
    } catch (error: any) {
        console.error('error:', error);
        res.status(500).json({
            status: 'ERROR',
            data: null,
            message: "",
        });
    }
}

export async function checkBirthday(req: any, res: any) {
    const { id } = req.params;
    try {
        const data: any = await UserModel.findById(id);
        if (!data) {
            return res.status(404).json({
                status: 'ERROR',
                data: null,
                message: 'User not found' 
            });
        }

        const { firstName, lastName, email } = data;
        const emailBody = `Hi ${firstName} ${lastName}, Happy Birthday to You`;
        const send = await sendEmail(emailBody, email);
        console.log(firstName);

        res.status(200).json({
            status: 'OK',
            data,
            message: 'Testing email is successfully',
        });
    } catch (error: any) {
        console.error('error:', error);
        res.status(500).json({
            status: 'ERROR',
            data: null,
            message: "",
        });
    }
}
