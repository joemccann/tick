!function(d,w){
  var editableList = d.getElementById('editable')
    , runningList = { items: [] }
  
  editableList.addEventListener('blur', function(){
    // Get all data from the ol
    saveList()
  } ,false)

  function setRunningList()
  {
     // in case it's not empty
    runningList.items = [];
    // We have to stash actual text because the NodeList is "live".
    Array.prototype.slice.call(d.querySelectorAll('#editable > li')).forEach(function(el,i){
      runningList.items.push(el.innerText)
    });
  }
  
  function saveList()
  {
    var allItems = Array.prototype.slice.call(d.querySelectorAll('#editable > li'))
      , changes = false
      , ws = /^\s|\t|\n$/
      , postList = { items:[] }
      

    // Sanitize the list first.
    allItems.forEach(function(el,i){
        if(!ws.exec(el.innerText)) 
        {
          tItem = {task: el.innerText, urgent: false};
          postList.items.push(tItem); 
        }
    })
      
    // check to see if any items have changed.
    postList.items.forEach(function(el,i){
      if(el.task !== runningList.items[i]) changes = true;
    })

    // check to see if the lengths are different
    if(postList.items.length != runningList.items.length) changes = true;
    
    // If nothing new, don't save.
    if(!changes) return;
    
    var options = {
      url: '/save',
      type: 'json',
      isExpressJsonRequest: true,
      method: 'POST',
      data: JSON.stringify(postList),
      success: function (resp) {
        console.log(resp.message);
        // Update the current list.
        setRunningList();
      },
      failure: function (err) {console.error(err) },
      headers: {}
    }
    
    options.headers['content-type'] = 'application/json'
    
    reqwest(options);
    
  }
  
  setRunningList();
  
}(document,window)