!function(d,w){
  
  var runningList = { items: [] }
    , $editable = d.getElementById('editable')
    , $legend = d.getElementById('legend')
    , isEditableFocused = false;

  /*
   * @desc Factory method to create an AttributeNode to be added to a DOM element.
   * @param String  The name of the attribute.
   * @param String|Boolean  The value to set, if passed. (optional)
   * @return AttributeNode
   */
  function attributeFactory(name, value)
  {
    var attr = d.createAttribute(name);
    value && (attr.nodeValue = value);
    return attr;
  }

  /*
   * @desc Method to place all tasks' text values in an array that we can use later for comparison.
   */
  function setRunningList()
  {
     // in case it's not empty
    runningList.items = [];
    // We have to stash actual text because the NodeList is "live".
    Array.prototype.slice.call(d.querySelectorAll('#editable > li')).forEach(function(el,i){
      runningList.items.push(el.innerText)
    });
  }

  /*
   * @desc Method that grabs the text values of the <li> nodes and sends to the server if their are changes to the ticks.
   */
  function saveList()
  {
    isEditableFocused = false;
    
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

      var currentItem = allItems[i];

      if( /^[^*]+[*]{1}[^*]*$/.test(el.task) )  
      {
        currentItem.removeAttribute('data-urgent')
        currentItem.innerText = currentItem.innerText.replace('*', '')
      }
      else if( currentItem.hasAttribute('data-urgent') || ( /^[^*]+[*]{2}[^*]*$/.test(el.task) ) )
      {
        currentItem.setAttributeNode( attributeFactory('data-urgent'), true)
        currentItem.innerText = currentItem.innerText.replace('**', '')
        el.urgent = true;
      }

      el.task = el.task.replace('**', '').replace('*', '');
    });

    // check to see if the lengths are different
    if(postList.items.length != runningList.items.length) changes = true;
    
    //console.log("Any changes? "+ changes)
    
    // If nothing new, don't save.
    if(!changes) return;
    
    var options = {
      url: '/save',
      type: 'json',
      isExpressJsonRequest: true, // this is my custom shit because Express/Connect freaks. 
      method: 'POST',
      data: JSON.stringify(postList),
      success: function (resp) {
        //console.log(resp.message);
        // Update the current list.
        setRunningList();
      },
      failure: function (err) {console.error(err) },
      headers: {}
    }
    
    options.headers['content-type'] = 'application/json'
    
    reqwest(options);
    
  }
  
  // Wire up events.
  
  $editable.addEventListener('blur',saveList,false)
  $editable.addEventListener('focus', function(){ isEditableFocused = true},false);
  
  $legend.addEventListener('webkitAnimationEnd', function(){
    var goingUp = (this.hasAttribute('data-slide-up') || this.className == 'slide_initial') ? true : false; 

    this.className = "";

    if(goingUp){
      this.style.height = "0px";
      this.removeAttribute('data-slide-up')
    }
    else{
      this.style.height = "156px";
      this.removeAttribute('data-slide-down')
    }
  });
  
  d.addEventListener('keyup', function(e){
    // If someone is writing a Tick, let the type the question mark without triggering the animation.
    if(isEditableFocused) return;
    if(e.keyCode == 191)
    {
      $legend
        .setAttributeNode( attributeFactory( ($legend.style.height === "0px") 
          ? 'data-slide-down' 
          : 'data-slide-up', true) )
    }    
  }, false)
  
  // Initialize, basically...
  setRunningList();
  
}(document,window)