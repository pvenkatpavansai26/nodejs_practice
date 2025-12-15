import app from './src/app.ts';
import {config} from './config/config.ts';
const startServer = () => {
  const port = config.port || 5000;;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);  
  });

};


startServer();