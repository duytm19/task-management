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

// [PATCH] /change-status/:id

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