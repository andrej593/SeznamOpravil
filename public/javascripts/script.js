var taskcounter=1;
function addTaskForm(el){    
    $(el).parent().find(".tasks").append('<div class="form-group card card-body">'+
        '<div class="form-group">'+
             '<label for="taskName" class="control-label">Task name</label>'+
             '<input type="text" class="form-control" name="taskName[]" id="taskName" placeholder="Task"/>'+
        '</div>'+
        '<div class="form-group">'+
             '<label for="taskDesc" class="control-label">Description</label>'+
             '<textarea class="form-control" name="taskDesc[]" id="taskDesc" placeholder="This is task description."></textarea>'+
        '</div>'+
        '<div class="form-group">'+
             '<label for="taskDateWarn" class="control-label">Warning date</label>'+
             '<input type="datetime-local" class="form-control" name="taskDateWarn[]" id="taskDateWarn" placeholder="Date.now()">'+
        '</div>'+
         '<div class="form-group">'+
             '<label for="taskDateEnd" class="control-label">Expiration date</label>'+
             '<input type="datetime-local" class="form-control" name="taskDateEnd[]" id="taskDateEnd" placeholder="Date.now()">'+
        '</div>'+
        '<div class="form-group">'+
             '<label for="taskListOfTags" class="control-label">Tags</label>'+
             '<div class="tags">'+
             '<input type="text" class="form-control" name="taskListOfTags[]['+taskcounter+']" id="taskListOfTags" placeholder="Tag"/>'+
             '</div>'+
             '<a class="btn btn-success btn-sm m-1" onclick="addTagFormLT(this,'+taskcounter+')">Add tag</a>'+
        '</div>'+
        '<span onClick="rmTaskForm(this)"><a class="btn btn-danger">Remove</a></span>'+
    '</div>');
    taskcounter++;
}
function addTagFormL(el){
    $(el).parent().find(".tags").append(' <div class="input-group">'+
        '<input type="text" class="form-control" name="listListOfTags[]" id="listListOfTags" placeholder="Tag"/>'+
        '<span class="input-group-text" style="color:red;" onClick="rmTagForm(this)">'+
        '<i class="fas fa-minus"></i></span></div>');
}
function addTagFormLT(el,num) {
    $(el).parent().find(".tags").append(' <div class="input-group">'+
        '<input type="text" class="form-control" name="taskListOfTags[]['+num+']" id="taskListOfTags" placeholder="Tag"/>'+
        '<span class="input-group-text" style="color:red;" onClick="rmTagForm(this)">'+
        '<i class="fas fa-minus"></i></span></div>');
}
function addTagFormT(el) {
    $(el).parent().find(".tags").append(' <div class="input-group">'+
        '<input type="text" class="form-control" name="taskListOfTags[]" id="taskListOfTags" placeholder="Tag"/>'+
        '<span class="input-group-text" style="color:red;" onClick="rmTagForm(this)">'+
        '<i class="fas fa-minus"></i></span></div>');
}
function rmTagForm(el) {
    $(el).parent().remove();
}
function rmTaskForm(el) {
    taskcounter--;
    $(el).parent().remove();
}
$(".addList").submit(function(e) {
    e.preventDefault();
    /*
    let data=new FormData(e.target);
    console.log(data.getAll("taskName[]"));
    console.log(data.getAll("taskListOfTasks[][0]"));
    */
    let listName=$('input[name="listName"]').val();
    if(!listName){
      listName="NoListName";
   }
    let listDesc=$('textarea[name="listDesc"]').val();
    if(!listDesc){
      listDesc = "NoListDesc";
   }
    let listListOfTags=$('input[name="listListOfTags[]"]').map(function(){
        if(!this.value){
            return {"tag":"NoTags"};
        }
        else 
            return {"tag":this.value};
    }).get();
    let taskName=$('input[name="taskName[]"]').map(function(){
        if(!this.value){
            return "NoTaskName";
        }
        else 
            return this.value;
    }).get();
    let taskDesc=$('textarea[name="taskDesc[]"]').map(function(){ 
        if(!this.value){
            return "NoDescription";
        }
        else 
            return this.value;
    }).get();
    let taskDateEnd=$('input[name="taskDateEnd[]"]').map(function(){ 
        if(!this.value){
            return new Date();
        }
        else 
            return this.value;
    }).get();
    let taskDateWarn=$('input[name="taskDateWarn[]"]').map(function(){ 
        if(!this.value){
            return new Date();
        }
        else 
            return this.value;
    }).get();
    let taskListOfTags=[];
    for(let i=0;i<taskcounter;i++){
        taskListOfTags[i]=$('input[name="taskListOfTags[]['+i+']"]').map(function(){ 
        if(!this.value){
            return {"tag":"NoTags"};
        }
        else 
            return {"tag":this.value};
        }).get();
    }
    let tasks=[];
    console.log(listListOfTags);
    
    for(let i=0;i<taskcounter;i++){
        tasks.push({"taskName":taskName[i],
        "taskDesc":taskDesc[i],
        "taskDateCreated":new Date(),
        "taskDateWarn":taskDateWarn[i],
        "taskDateEnd":taskDateEnd[i],
        "taskStatus":false,
        "taskListOfTags":taskListOfTags[i]});
    }
    console.log(tasks);
    let message = {"listName":listName,
    "listDesc":listDesc,
    "listCreated":new Date(),
    "listStatus":false,
    "listListOfTags":listListOfTags,
    "listTasks":tasks};
    console.log(message);
    message=JSON.stringify(message);
    $.post({
        url:"http://localhost:3000/list",
        data:message,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success:function(list){
         //to lazy to append html or add new route instead of ajax
         window.location.reload();
        }
    });
});
function toggleIcon(el){
    $(el).find("span").toggleClass('fa-arrow-circle-down fa-arrow-circle-up');
}

$('.addTask').submit(function(e){
    e.preventDefault();
    let data=new FormData(e.target);
    let tags = data.getAll("taskListOfTags[]");
    let message = {"taskName":data.get("taskName"),
                    "taskDesc":data.get("taskDesc"),
                    "taskDateCreated":new Date(),
                    "taskDateWarn":data.get("taskDateWarn"),
                    "taskDateEnd":data.get("taskDateEnd"),
                    "taskStatus":false,
                    "taskListOfTags":[]              
                };
    tags.forEach(tag => {
        message.taskListOfTags.push({"tag":tag})
    });
    if(!message.taskName){
        message.taskName="NoTaskName";
    }
    if(!message.taskDesc){
        message.taskDesc="NoDescription";
    }
    if(!message.taskDateWarn){
        message.taskDateWarn=new Date();
    }
    if(!message.taskDateEnd){
        message.taskDateEnd=new Date();
    }
    console.log(message.taskListOfTags[0]);
    if(message.taskListOfTags[0].tag==''){
      message.taskListOfTags[0].tag="NoTags";
    }
    message.taskListOfTags=JSON.stringify(message.taskListOfTags);

    $.ajax({
        url: "http://localhost:3000/list/addTask/"+data.get("id"),
        data:message,
        type: 'PUT',
        success: function(task){
            //to lazy to append html or add new route instead of ajax
            window.location.reload();
        }
    });
});

$('.updateList').submit(function(e){
    e.preventDefault();
    let data=new FormData(e.target);
    let message = {"listName":data.get("listName"),
                    "listDesc":data.get("listDesc")};
    $.ajax({
        url: "http://localhost:3000/list/"+data.get("id"),
        data:message,
        type: 'PUT',
        success: function(list){
         $(e.target).parent().parent().parent().parent().parent().find('.card-title').find('.row').find('.col-2').find('h3').text(list.listName);
         $(e.target).parent().parent().parent().parent().parent().find('.collapse').find('.listDesc').text(list.listDesc);
        }
    });
});
$('.updateTask').submit(function(e){
    e.preventDefault();
    let data=new FormData(e.target);
    let message = {"taskName":data.get("taskName"),
                    "taskDesc":data.get("taskDesc")};
    $.ajax({
        url: "http://localhost:3000/list/updateTask/"+data.get("id")+"/"+data.get("idT"),
        data:message,
        type: 'PUT',
        success: function(task){
         $(e.target).parent().parent().parent().parent().parent().find('.row').find('.col-3').find('h3').text(task.taskName);
         $(e.target).parent().parent().parent().parent().parent().find('.collapse').find('.taskDesc').text(task.taskDesc);
        }
    });
});
$('.changeDateEnd').submit(function(e){
    e.preventDefault();
    let data=new FormData(e.target);
    let date=new Date(data.get("taskDateEnd"));
    let message = {"taskDateEnd":date};
    $.ajax({
        url: "http://localhost:3000/list/changeTaskEndDate/"+data.get("id")+"/"+data.get("idT"),
        data:message,
        type: 'PUT',
        success: function(res){
            $(e.target).parent().find('label').text('Expiration date:'+date.toUTCString());
        }
    });
});
$('.changeDateWarn').submit(function(e){
     e.preventDefault();
     let data=new FormData(e.target);
     let date=new Date(data.get("taskDateWarn"));
     let message = {"taskDateWarn":data.get("taskDateWarn")};
     $.ajax({
         url: "http://localhost:3000/list/changeTaskWarnDate/"+data.get("id")+"/"+data.get("idT"),
         data:message,
         type: 'PUT',
         success: function(res){
            $(e.target).parent().find('label').text('Warning date:'+date.toUTCString());
         }
     });
 });

function addTagToList(el){
   let id = $(el).attr('id');
   let tag=$(el).parent().find("input").val();
   let message = {"tag":tag};
   $.ajax({
      url: "http://localhost:3000/list/addListTag/"+id,
      data:message,
      type: 'PUT',
      success: function(tag){
         $(el).parent().parent().parent().find('.tagList').append('<span class="badge bg-primary rounded-pill m-1 fs-5">'+
            tag.tag+'<a class="btn btn-danger btn-sm" id="'+id+','+tag._id+'" onclick="rmTagFromList(this)">'+
            '<i class="fas fa-remove"></i></a></span>');
      }
   });
}
function addTagToTask(el){
   let ids = $(el).attr('id').split(',');
   let id=ids[0];
   let idT=ids[1];
   let tag=$(el).parent().find("input").val();
   let message = {"tag":tag};
   $.ajax({
      url: "http://localhost:3000/list/addTaskTag/"+id+"/"+idT,
      data:message,
      type: 'PUT',
      success: function(tag){
         $(el).parent().parent().parent().find('.tagList').append('<span class="badge bg-primary rounded-pill m-1 fs-5">'+
            tag.tag+'<a class="btn btn-danger btn-sm" id="'+id+','+idT+','+tag._id+'" onclick="rmTagFromTask(this)">'+
            '<i class="fas fa-remove"></i></a></span>');
      }
   });
}
function rmTagFromList(el){
    let ids = $(el).attr('id').split(',');
    let id=ids[0];
    let idT2=ids[1];
   let message = {"tag":$(el).parent().text()};
   $.ajax({
      url: "http://localhost:3000/list/deleteListTag/"+id+"/"+idT2,
      data:message,
      type: 'PUT',
      success: function(res){
         $(el).parent().remove();
      }
   });
}
function rmTagFromTask(el){
   let ids = $(el).attr('id').split(',');
   let id=ids[0];
   let idT=ids[1];
   let idT2=ids[2];
   let message = {"tag":$(el).parent().text()};
   $.ajax({
      url: "http://localhost:3000/list/deleteTaskTag/"+id+"/"+idT+"/"+idT2,
      data:message,
      type: 'PUT',
      success: function(res){
         $(el).parent().remove();
      }
   });
}
function removeList(el){
   let id = $(el).attr('id');
   $.ajax({
      url: "http://localhost:3000/list/"+id,
      type: 'DELETE',
      success: function(res){
         $(el).parent().parent().parent().parent().parent().parent().remove();
      }
   });
}
function removeTask(el){
   let ids = $(el).attr('id').split(',');
   let id=ids[0];
   let idT=ids[1];
   $.ajax({
      url: "http://localhost:3000/list/deleteTask/"+id+"/"+idT,
      type: 'PUT',
      success: function(res){
         $(el).parent().parent().parent().parent().parent().remove();
      }
   });
}
function changeStatusL(el){
   let id = $(el).attr('id');
    $.ajax({
         url: "http://localhost:3000/list/changeListStatus/"+id,
         type: 'PUT',
         success: function(list){
            $(el).parent().parent().parent().parent().parent().parent().toggleClass('text-decoration-line-through');
            if(list.listStatus){
                console.log("TRUE");
                $(el).parent().parent().parent().parent().parent().parent().find('.changeStatus.btn-danger').toggleClass('btn-danger btn-success');
                $(el).parent().parent().parent().parent().parent().parent().find('.fa-square').toggleClass('fa-check-square fa-square');
                $(el).parent().parent().parent().parent().parent().parent().find('.border-danger').toggleClass('border border-danger');
                $(el).parent().parent().parent().parent().parent().parent().find('li').addClass('text-decoration-line-through');
            }else{
                $(el).toggleClass('btn-danger btn-success');
                $(el).find("span").toggleClass('fa-check-square fa-square');
            }
         }
     });
}
function changeStatusT(el){
    let ids = $(el).attr('id').split(',');
    let id=ids[0];
    let idT=ids[1];
    $.ajax({
         url: "http://localhost:3000/list/changeTaskStatus/"+id+"/"+idT,
         type: 'PUT',
         success: function(task){
            if(new Date(task.taskDateWarn)<new Date() && !task.taskStatus){
                //ce je task off in je poteko ga vlopis
               $(el).parent().parent().parent().parent().toggleClass('border border-danger');
            }
            //če je on ga izklopis
            if(task.taskStatus){
                $(el).parent().parent().parent().parent().parent().find('.border-danger').toggleClass('border border-danger');
            }
            $(el).parent().parent().parent().parent().parent().toggleClass('text-decoration-line-through');
            $(el).toggleClass('btn-danger btn-success');
            $(el).find("span").toggleClass('fa-check-square fa-square');
         }
     });
}

//APPEND HTML WHEN ADDING TASKS OR LISTS