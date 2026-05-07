import 'dotenv/config';
import app  from './src/app.mjs';
import  connectDB  from './src/config/dbconfig.mjs';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();