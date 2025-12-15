import app from './src/app.ts';

const startServer = () => {
  const port = process.env.PORT || 5000;;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);  
  });

};


startServer();