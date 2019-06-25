if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://sunny:Sunny123@Rishi123@cluster0-rbwrl.mongodb.net/test?retryWrites=true'}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot'}
  }