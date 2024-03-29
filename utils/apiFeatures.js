class APIFeatures {
    constructor(query,queryString){
      this.query = query;
      this.queryString = queryString;
    }
    filter(){
       // 1) Filtering
       const queryObj = {...this.queryString};
       const excludeFields = ['page','sort','limit','fields'];
       excludeFields.forEach(el=>delete queryObj[el]);
  
       // 2) Advanced Filtering
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
       this.query.find(JSON.parse(queryStr));
  
       return this;
    }
    sort(){
      if(this.queryString.sort){
        let sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      }else{
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      }else{
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginatePage(){
      const page = Number(this.queryString.page) || 1;
      const limit = Number(this.queryString.limit); 
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
      // if(this.queryString.page){
      //   this.query.countDocuments();
      //   if(skip >= numTours ) throw new Error("The page doesn't exist");
      // }
      return this;
    }
  }

  module.exports = APIFeatures;