var budgetController = (function()
    {
    var Expenses = function (id,desc,value){
            this.id=id;
            this.desc=desc;
            this.value=value;
            this.percent_expense=0;
        }
    /*Expenses.prototype.per_cal = function () 
        {
        var per_e=0;
        if(Data.totals.exp===0)
            {
        this.percent_expense=(parseInt(this.value)/Data.totals)*100;
            }
        else {
            this.percent_expense=(parseInt(this.value)/Data.totals.inc)*100;
        }
        }*/
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
            },
    percentageUpdater : function () 
        {
          Data.totalItems['exp'].forEach(function (curr) {
              budgetController.percentage_individual(curr);
          })  
        },
    percentage_individual : function (item)
        {
            var percentage_e=0,total=0;
            Data.totalItems['inc'].forEach(function (curr) {
                total+=curr.value;
            })
            percentage_e=(item.value/total)*100;
            item.percent_expense=percentage_e;
        },
    calculateTotalBudget : function ()
        {

            var incom=0,expense=0,total_b,percnt_total=0;
            
            Data.totalItems['inc'].forEach(function(curr) {
                incom=incom+curr.value;
            })
            Data.totalItems['exp'].forEach(function(curr) {
                expense=expense+curr.value;
            })
            total_b=incom-expense;
            percnt_total=(expense/incom)*100;
            return [total_b,percnt_total];
            
        },
    calculateIncomNexp : function (type) 
        {
            var part_var=0;
            if(type==='inc')
                {
                    Data.totalItems[type].forEach(function(curr) {
                    part_var=part_var+curr.value;
                    })
                    return part_var;
                }
            else if (type==='exp')
                {
                    Data.totalItems[type].forEach(function(curr) {
                    part_var=part_var+curr.value;
                    })
                    return part_var;
                }
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
        budget_value : '.budget__value',
        budget_percent  : '.budget__expenses--percentage'
        
    }
    
    return  {
        getInput : function () 
                {
                    return {
                            type : document.querySelector(dom.add_type).value,//will give exp or inc
                            description: document.querySelector(dom.add_desc).value,
                            value : parseFloat(document.querySelector(dom.add_value).value)
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
                    html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%per%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    }
                new_html=html.replace('%id%',obj.id);
                new_html=new_html.replace('%description%',obj.desc);
                new_html=new_html.replace('%value%',obj.value);
                if(type==='exp'){
                budgetController.percentage_individual(obj);
                new_html=new_html.replace('%per%',Math.floor(obj.percent_expense));
                }
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
                },
        budget_percent_calculator : function ()
            {
                        budget_data=budgetController.calculateTotalBudget();
                        document.querySelector(dom.budget_value).textContent=budget_data[0]; // display total budget remaining inc - exp
                        document.querySelector(dom.budget_percent).textContent=Math.ceil(budget_data[1])+'%';
                
            },
        incom_exp_ader : function (data,type)
            {
            if (type==='inc')
                {
                    document.querySelector(dom.budget_incom_value).textContent=data;
                }
            else if (type==='exp')
                {
                    document.querySelector(dom.budget_expense_value).textContent=data;
                }
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
                document.querySelector(dom.budget_percent).textContent=0;
            })();

        var cntrlAddItem = function () 
            {
                var new_item,input,inc_exp,budget_data;
                input=UICntrl.getInput();
                if(input.description==='' || (Number.isNaN(input.value) && input.value>0))
                    {
                        UICntrl.clearInputFields();
                    }
                else
                    {
                        new_item= budgetCtrl.addItem(input.type,input.description,input.value);
                        UICntrl.addUIItem(new_item,input.type); //adding items under expense or incom list
                        inc_exp=budgetCtrl.calculateIncomNexp(input.type);
                        UICntrl.incom_exp_ader(inc_exp,input.type); //add total expenese and incom to UI
                        UICntrl.budget_percent_calculator();
                        UICntrl.clearInputFields();
                    }
            
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