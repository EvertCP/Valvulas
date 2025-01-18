import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta para procesar cotizaciones
app.post('/api/cotizacion', async (req, res) => {
    try {
        const {
            nombre,
            empresa,
            email,
            telefono,
            tipoValvula,
            material,
            tamanio,
            otroTamanio,
            presion,
            temperatura,
            fluido,
            conexion,
            cantidad,
            aplicacion,
            comentarios
        } = req.body;

        // Crear el contenido del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL, // Email del administrador
            subject: `Nueva Solicitud de Cotización - ${empresa}`,
            html: `
                <h2>Nueva Solicitud de Cotización</h2>
                <h3>Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Empresa:</strong> ${empresa}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>

                <h3>Especificaciones de la Válvula</h3>
                <p><strong>Tipo de Válvula:</strong> ${tipoValvula}</p>
                <p><strong>Material:</strong> ${material}</p>
                <p><strong>Tamaño:</strong> ${tamanio === 'otro' ? otroTamanio : tamanio}</p>
                <p><strong>Presión de Operación:</strong> ${presion} PSI</p>
                <p><strong>Temperatura:</strong> ${temperatura}°C</p>
                <p><strong>Fluido:</strong> ${fluido}</p>
                <p><strong>Tipo de Conexión:</strong> ${conexion}</p>

                <h3>Información Adicional</h3>
                <p><strong>Cantidad:</strong> ${cantidad}</p>
                <p><strong>Aplicación:</strong> ${aplicacion || 'No especificada'}</p>
                <p><strong>Comentarios:</strong> ${comentarios || 'Ninguno'}</p>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Enviar correo de confirmación al cliente
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmación de Solicitud de Cotización - Válvulas Cuevas VCJ',
            html: `
                <h2>Gracias por su solicitud de cotización</h2>
                <p>Estimado/a ${nombre},</p>
                <p>Hemos recibido su solicitud de cotización y nos pondremos en contacto con usted a la brevedad posible.</p>
                <p>Número de seguimiento: ${Date.now()}</p>
                <br>
                <p>Atentamente,</p>
                <p>Equipo de Válvulas Cuevas VCJ</p>
            `
        };

        await transporter.sendMail(clientMailOptions);

        // Guardar en base de datos (aquí podrías agregar la lógica para guardar en una base de datos)

        res.status(200).json({
            success: true,
            message: 'Solicitud de cotización recibida correctamente'
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud'
        });
    }
});

// Ruta para procesar mensajes de contacto
app.post('/api/contacto', async (req, res) => {
    try {
        const {
            nombre,
            email,
            telefono,
            asunto,
            mensaje
        } = req.body;

        // Crear el contenido del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `Nuevo Mensaje de Contacto - ${asunto}`,
            html: `
                <h2>Nuevo Mensaje de Contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
                <p><strong>Asunto:</strong> ${asunto}</p>
                <h3>Mensaje:</h3>
                <p>${mensaje}</p>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Enviar correo de confirmación al cliente
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmación de Mensaje - VCJ Válvulas Cuevas Jessi',
            html: `
                <h2>Gracias por contactarnos</h2>
                <p>Estimado/a ${nombre},</p>
                <p>Hemos recibido su mensaje y nos pondremos en contacto con usted a la brevedad posible.</p>
                <br>
                <p>Atentamente,</p>
                <p>Equipo de VCJ Válvulas Cuevas Jessi</p>
            `
        };

        await transporter.sendMail(clientMailOptions);

        res.status(200).json({
            success: true,
            message: 'Mensaje recibido correctamente'
        });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el mensaje'
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
