var budgetController = (function()
    {
    var Expenses = function (id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
        this.percentage
    }
    var Incom = function (id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
        
    }
    var Data = 
        {
            totalItems : 
                {
                    exp : [],
                    inc : []
                },
            totals : 
                {
                    exp : 0,
                    inc : 0,
                }
        }
return {
    addItem : function (type,desc,val) 
    {            
        var newItem,ID;
            if(Data.totalItems[type].length>0)
                {
                    ID = Data.totalItems[type][Data.totalItems[type].length-1].id+1;
                }
            else
                {
                    ID = 0;
                }
            if (type=='exp')
                {
                    newItem = new Expenses(ID,desc,val)
                }
            else if (type=='inc')
                {
                    newItem = new Incom(ID,desc,val)
                }
            Data.totalItems[type].push(newItem);
            return newItem;
        },
    dataManu : function ()
            {
                return Data;
            }
    };
    
    }
)();

var UIController = (function()
    {
    var dom = {
        add_type : '.add__type',
        add_desc : '.add__description',
        add_value : '.add__value',
        add_btn : '.add__btn',
        budget_incom_value : '.budget__income--value',
        budget_expense_value : '.budget__expenses--value',
        budget_value : '.budget__value'
        
    }
    
    return  {
        getInput : function () 
                {
                    return {
                            type : document.querySelector(dom.add_type).value,//will give exp or inc
                            description: document.querySelector(dom.add_desc).value,
                            value : parseInt(document.querySelector(dom.add_value).value)
                            };
                 
            
                },
        getdomStrings : function ()
            {
                return dom;
            },
        addUIItem : function (obj,type)
            {
                if(type==='inc')
                    {
                        element_incORexp='.icome__title';
                        html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    }

                else if(type==='exp')
                    {
                        element_incORexp='.expenses__title';
                        html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    }
                new_html=html.replace('%id%',obj.id);
                new_html=new_html.replace('%description%',obj.desc);
                new_html=new_html.replace('%value%',obj.value);
                document.querySelector(element_incORexp).insertAdjacentHTML('beforeend',new_html);
                
            },
        clearInputFields : function () 
                {
                    var fields,fieldsArr;
                    fields = document.querySelectorAll(dom.add_desc+','+dom.add_value);
                    fieldsArr = Array.prototype.slice.call(fields);
                    fieldsArr.forEach(function (current,index,array) {
                        current.value='';
                    })
                fieldsArr[0].focus();
                }
            };

    
    }
)();

var controller = (function(budgetCtrl,UICntrl)
    {
    var dom=UICntrl.getdomStrings();
    var rem_budget;
     (function ()
            {
                document.querySelector(dom.budget_incom_value).textContent=0;
                document.querySelector(dom.budget_expense_value).textContent=0;
                document.querySelector(dom.budget_value).textContent=0;
            })();
        var cntrlAddItem = function () 
            {
                var new_item,input,total_data;
                input=UICntrl.getInput();
                new_item= budgetCtrl.addItem(input.type,input.description,input.value);
                UICntrl.addUIItem(new_item,input.type);
                total_data=budgetCtrl.dataManu();
                total_data.totals[input.type]=total_data.totals[input.type]+input.value;
                if(input.type==='inc')
                    {
                        document.querySelector('.budget__income--value').textContent=total_data.totals[input.type];
                    }
                else if(input.type==='exp')
                    {
                        document.querySelector('.budget__expenses--value').textContent=total_data.totals[input.type];
                    }
                rem_budget = total_data.totals.inc-total_data.totals.exp;
                document.querySelector(dom.budget_value).textContent=rem_budget;
                UICntrl.clearInputFields();
            
            }
        
        return {
                init_event_list : function ()
                        {
                            document.querySelector(dom.add_btn).addEventListener('click',cntrlAddItem);
                            document.addEventListener('keypress', function (event) {
                            if(event.keyCode===13 || event.which===13)
                                {
                                    cntrlAddItem();
                                }
                            })
                        }

        };
    }
                  
)(budgetController,UIController);


controller.init_event_list(); // to initialize event listeners