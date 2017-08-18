var SELECT = 4; // 0001
var EDIT = 2; // 010
var REMOVE = 1; // 100

function getTableButtons(name, buttons) {
//ser <- 9f 
    var selectButton = ''
    var editButton  = ''
    var removeButton = ''
    if ( buttons.toString(2) & SELECT) {
      selectButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Select" id="'+name+'select">Select</button> &nbsp; '
    }
    if ( buttons.toString(2) & EDIT) {
      editButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Edit" id="'+name+'edit" data-toggle="modal" data-target="#'+name+'modal">Edit</button> &nbsp;'
    }
    if ( buttons.toString(2) & REMOVE) {
      removeButton = '<button type="button" class="btn btn-primary btn-sm" title="Remove" id="'+name+'remove">Remove</button></div>'
    }
    return selectButton + editButton + removeButton
}

$('#tags').on('keyup',function(e){
    var tagElems = $('#autocompletes1').children()

      $(tagElems).hide()
      for(var i = 0; i < tagElems.length; i++){
          var tagElems2 = $(tagElems).eq(i).children().eq(1).children()
             $(tagElems2).hide()
             $(tagElems).eq(i).closest('li').children('ul.treeview-menu').hide()
             for(var j = 0; j < tagElems2.length; j++){              
                if(($(tagElems2).eq(j).text().toLowerCase()).indexOf($(this).val().toLowerCase()) === 0){
                    $(tagElems).eq(i).show()
                    if ($(this).val().toLowerCase() != "") {
                        $(tagElems).eq(i).closest('li').addClass('menu-open')
                        $(tagElems).eq(i).closest('li').children('ul.treeview-menu').show()
                    }else{
                        $(tagElems).eq(i).closest('li').removeClass('menu-open')
                    }  

                    $(tagElems2).eq(j).show()
             }
          }
      }
    
});
