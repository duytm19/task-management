const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find={
        deleted:false
    }

    if(req.query.status){
        find.status = req.query.status
    }

    //Sort
    const sort={}
    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey]= req.query.sortValue
    }
  //Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    //End Search
    //Pagination
      const countProducts = await Task.countDocuments(find);
      let objectPagination = paginationHelper(
        {
          limitItems: 2,
          currentPage: 1,
        },
        req.query,
        countProducts
      );
    //End sort
    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    res.json(tasks)
  };

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json("Can't find!");
  }
};

// [PATCH] /api/v1/tasks/change-status/:id

module.exports.changeStatus =async (req,res)=>{
  try{
    const id=req.params.id
    const status = req.body.status

    await Task.updateOne({
      _id:id
    },{
      status: status
    })
    res.json({
      code:200,
      message:"Change status successfully"
    })
  }catch(error){
    res.json({
      code:400,
      message:error
    })
  }
}
// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req,res)=>{
  try{
    const {ids,key,value}=req.body

    switch(key){
      case "status":
        await Task.updateMany({
          _id:{$in:ids}
        },{
          status:value
        })
        res.json({
          code:200,
          message:"Change multi status successfully!"
        })
        break

      default:
        res.json({
          code:400,
          message:"Is not existence!"
        })
        break
    }
  }catch(error){
    res.json({
      code:400,
      message:"Is not existence!"
    })
  }
}
// [POST] /api/v1/tasks/create
module.exports.create = async (req,res)=>{
  try{
    const task = new Task(req.body)
    const data= await task.save()
    res.json({
      code:200,
      message:"Create new task successfully!",
      data:data
    })
  }catch(error){
      res.json({
        code:400,
        message:error
      })
  }
}
// [POST] /api/v1/tasks/edit/:id
module.exports.edit = async (req,res)=>{
  try{
    const id = req.params.id
    await Task.updateOne({
      _id:id
    },req.body)
    res.json({
      code:200,
      message:"Edit task successfully!",
      data:data
    })
  }catch(error){
      res.json({
        code:400,
        message:error
      })
  }
}