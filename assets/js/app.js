const cl = console.log;
const postcontainer = document.getElementById("postcontainer");
const postForm = document.getElementById("postForm");
const titleConrol = document.getElementById("title");
const bodyConrol = document.getElementById("body");
const userIdConrol = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const UpdateBtn = document.getElementById("UpdateBtn");
const loader= document.getElementById("loader");





let baseUrl = `https://fetchxml-d36c9-default-rtdb.asia-southeast1.firebasedatabase.app/`


let postsUrl = `${baseUrl}/posts.json`
cl(postsUrl)

// let obj={
//     fname:"AbortCont",
//     lname:"abc",
// }
// localStorage.setItem("object",JSON.stringify(obj));


//fetch >> its brawser api introduced by html5
//it returns promise

// POST 
// GET
// PUT/PATCH
// DELETE
// let onEdit=(edt)=>{
//     cl(edt)
//     let editid= edt.closest(".card").id
//    // cl(editid)
//    localStorage.setItem("edtid1", editid);
//     let edturl= `${postsUrl}/posts/${editid}.json`
//     .then((res)=>{
//         return res.json()

//    })

//     }
//     apiall(edturl,"GET")
//     .then((data1)=>{
//          titleConrol.value=data1.title,
//          bodyConrol.value=data1.body,
//          userIdConrol.value=data1.userId
//     })
//     .catch((err)=>{
//         cl(err)
//     })
//cl(edturl)
let onEdit = (element1) => {
    //  cl(element1)
    loader.classList.remove("d-none")
    let editid = element1.closest(".card").id;
      cl(editid)
    localStorage.setItem("edtid", editid)
    let edturl = `${baseUrl}/posts/${editid}.json`
    // cl(edturl)
    apiall(edturl, "GET")
        .then(res => {
            // cl(res)
                      titleConrol.value=res.title,
                      bodyConrol.value=res.body,
                      userIdConrol.value=res.userId
                      loader.classList.add("d-none")
                      UpdateBtn.classList.remove("d-none");
                      submitBtn.classList.add("d-none")
                      window.scrollTo(0,0)
        })
        
        .catch(cl)      
}
let onDelet=(dlt)=>{
   let dltid=dlt.closest(".card").id;
   cl(dltid) 
   let dlturl=`${baseUrl}/posts/${dltid}.json`
   cl(dlturl)
  
   Swal.fire(
    {
    
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
}).then((result) => {
    
    if (result.isConfirmed) {
        fetch(dlturl,"DELETE")
            .then(res => {
                
                document.getElementById(dltid).remove()
            })
            .catch(err => {
                cl(err)
            })
            .finally(() => {
                postForm.reset()
            })
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 1000,
        });

    }
})

}


let onPostupdate=(update)=>{
    loader.classList.remove("d-none")
    let updid= localStorage.getItem("edtid");
    // cl(updid)
    let updurl=`${baseUrl}/posts/${updid}.json`
    cl(updurl)
    let newobjup={
        title:titleConrol.value,
        body:bodyConrol.value,
        userId:userIdConrol.value
    }
    
apiall(updurl,"PATCH",JSON.stringify(newobjup))
.then((res)=>{
    cl(res)
    loader.classList.add("d-none")
    let updobj=[...document.getElementById(updid).children];
    cl(updobj)
    updobj[0].innerHTML=`<h2>${res.title}</h2>`;
    updobj[1].innerHTML=`<p>${res.body}</p>`;
})
.catch(cl)
.finally(()=>{
   
    submitBtn.classList.remove("d-none")
    UpdateBtn.classList.add("d-none")
    postForm.reset()
})
    
}

let creatcard=((creat)=>{
    let post = document.createElement("div");
    post.className = "card mb-4";
    post.id = creat.id;
    post.innerHTML = ` <div class="card-header">
    <h2>${creat.title}</h2>
        </div>
    <div class="card-body">
    <p>
      ${creat.body}
        </p>
          </div>
      <div class="card-footer d-flex justify-content-between">
     <button class="btn btn-primary" onclick="onEdit(this)">
         Edit
        </button>
        <button class="btn btn-danger" onclick="onDelet(this)">
        Delete
        </button>
    </div>
    `
    postcontainer.append(post)

})
let onsubmitPost=(add)=>{
    loader.classList.remove("d-none")
   
    add.preventDefault()
let subobj={
    title:titleConrol.value,
    body:bodyConrol.value,
    userId:userIdConrol.value
}

cl(subobj)
apiall(postsUrl,"POST",JSON.stringify(subobj))
.then((res)=>{
    loader.classList.add("d-none")
    // cl(res)
    subobj.id=res.name
    creatcard(subobj)
})
.catch(cl)
.finally(()=>{
    postForm.reset()
})
}
let templating = ((temp) => {
   
    temp.forEach(ele => {
        creatcard(ele)
           });
})


let objecttoarr = (objectto) => {
    let objarr = [];
    for (let key in objectto) {
        let postc = objectto[key];
        postc.id = key;
        objarr.push(postc);
        // cl(objarr)
    }
    return objarr

}

let apiall = (apiurl, methodname, datainfo = null) => {
    return fetch(apiurl, {
        method: methodname,
        body: datainfo,
        headers: {
            "Content-type": "Application/json"
        }
    })
        .then((res) => {
            return res.json()//return promise
        })
}
apiall(postsUrl, "GET")
    .then((data) => {
        cl(data)
        let obj1 = objecttoarr(data);
        
        templating(obj1)
        // cl(obj1)
    })
    .catch((err) => {
        cl(err)
    })
    
postForm .addEventListener("submit",onsubmitPost)
 UpdateBtn.addEventListener("click",onPostupdate)
