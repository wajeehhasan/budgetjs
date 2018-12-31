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
    Expenses.prototype.get_per = function () 
    {
        return this.percent_expense;
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
    deleteItem : function (type,id)
        { var ind_ele;
          Data.totalItems[type].forEach(function (curr,ind)
                    {
                        if(curr.id===id)
                            {
                                ind_ele=ind;
                            }
                        
                    })
         Data.totalItems[type].splice(ind_ele,1);
        },
    test : function ()
    {
      console.log(Data);  
    },
    dataManu : function ()
            {
                return Data;
            },
    getPercentages : function () 
        {
            var per;
          per = Data.totalItems['exp'].map(function (curr) {
            return curr.get_per();
          })  
            return per;
        },
    percentage_updater : function () {
        var total_inc,percent;
        data_b=budgetController.calculateTotalBudget();
        total_inc=data_b[2];
        Data.totalItems.exp.forEach(function(curr){
            percent=(curr.value/total_inc)*100;
            curr.percent_expense=percent;
            
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
            return [total_b,percnt_total,incom,expense];
            
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
        budget_percent  : '.budget__expenses--percentage',
        container : '.container',
        indi_per : '.item__percentage',
        month_year : '.budget__title--month'
        
    }
    
    return  {
        init_month_year : function () 
            {
                var time_data = new Date(),month_list,month,year,m_y;
                month_list = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];
                
                month=time_data.getMonth();
                year=time_data.getFullYear();
                month=month_list[month];
                m_y=month+' '+year;
                document.querySelector(dom.month_year).textContent=m_y;
                    
            },
        
        
        change_clr : function () 
            
            {
            var fields;
            fields=document.querySelectorAll(dom.add_type+','+dom.add_desc+','+dom.add_btn+','+dom.add_value);
            var forEachNode = function (list,callback)
                {
                for(i=0; i<list.length; i++)
                    {
                        callback(list[i]);
                    }
                };
            forEachNode(fields, function (cur) {
                cur.classList.toggle('red-focus');    
            })
                document.querySelector(dom.add_btn).classList.toggle('red');
            },
        // add__type // add__description // add__value // add__btn
        
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
                        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    }

                else if(type==='exp')
                    {
                    element_incORexp='.expenses__title';
                    html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%per%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    }
                new_html=html.replace('%id%',obj.id);
                new_html=new_html.replace('%description%',obj.desc);
                var new_number;
                new_number=UIController.number_formater(obj.value,type);
                new_html=new_html.replace('%value%',new_number);
                if(type==='exp'){
                budgetController.percentage_individual(obj);
   
                        
                    if(obj.percent_expense == Number.POSITIVE_INFINITY || obj.percent_expense == Number.NEGATIVE_INFINITY)
                        {
                            new_html=new_html.replace('%per%','__');
                        }
                    else {
                new_html=new_html.replace('%per%',Math.ceil(obj.percent_expense)+'%'); }
                }
                document.querySelector(element_incORexp).insertAdjacentHTML('beforeend',new_html);
                
            },
        deleteUIItem : function (elemID) 
            {
            document.getElementById(elemID).parentNode.removeChild(document.getElementById(elemID));
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
        percent_individual_UIAder : function () 
            {
                var per_list,fields;
                per_list=budgetController.getPercentages();
                fields = document.querySelectorAll(dom.indi_per);
                var nodeUpdate = function (list, callback)
                    {
                        for(i=0;i<list.length;i++)
                            {
                                callback(list[i],i);
                            }
                    }
                nodeUpdate(fields, function (curr,ind) {
                    if(per_list[ind] == Number.POSITIVE_INFINITY || per_list[ind] == Number.NEGATIVE_INFINITY){
                    curr.textContent ='__';    
                    }
                    else {
                    curr.textContent = Math.round(per_list[ind])+'%';} 
                    
                }) 
            },
        budget_percent_calculator : function ()
            {
                        budget_data=budgetController.calculateTotalBudget();
                var new_number;
                // display total budget remaining inc - exp
                        if(budget_data[0]>0)
                            {
                                new_number=UIController.number_formater(Math.abs(budget_data[0]),'bug');
                                document.querySelector(dom.budget_value).textContent='+'+new_number;
                            }
                        else if (budget_data[0]<0)
                            {
                                new_number=UIController.number_formater(Math.abs(budget_data[0]),'bug');
                                document.querySelector(dom.budget_value).textContent='-'+new_number;

                            }
                else if (budget_data[0]===0)
                    {
                        new_number=UIController.number_formater(Math.abs(budget_data[0]),'bug');
                        document.querySelector(dom.budget_value).textContent=new_number;

                    }
                        if(Number.isNaN(budget_data[1]) || budget_data[1]===0 || budget_data[2]==0){
                            document.querySelector(dom.budget_percent).textContent='...'
                        }
                else {
                
                        document.querySelector(dom.budget_percent).textContent=Math.ceil(budget_data[1])+'%';}
                        new_number=UIController.number_formater(budget_data[2],'inc');
                        document.querySelector(dom.budget_incom_value).textContent=new_number;
                new_number=UIController.number_formater(budget_data[3],'exp');
                        document.querySelector(dom.budget_expense_value).textContent=new_number;
                
                        // return [total_b,percnt_total,incom,expense];
                
            },
        number_formater : function (number,type) 
            {
            var string_number,int_number,deci_number,splitnum,final_number='';
            var num_arr = [];
            var final_arr = [];
            var string_number,int_number,deci_number,splitnum,final_number='';
            var num_arr = [];
            var final_arr = [];
                string_number= number.toFixed(2);
                splitnum=string_number.split('.');
                int_number=splitnum[0];
                deci_number=splitnum[1];
                for (i=0;i<int_number.length;i++)
                    {
                        num_arr.push(int_number[i]);
                        
                    }
                for (i=2;i<(num_arr.length-1);i=i+2)
                    {
                        if(i===2)
                            {
                                
                                num_arr.splice(-3,0,',');
                                i=3;
                            }
                        else{
                            
                        
                        
                        num_arr.splice(-(i+1),0,',');
                        i++;}
                    }
                
                
                
                for(i=0;i<num_arr.length;i++)
                    {
                        final_number+=num_arr[i];
                    }
                final_number=final_number+'.'+deci_number;
                if(type==='inc')
                    {
                        final_number='+'+final_number;
                    }
                else if(type==='exp')
                    {
                        final_number='-'+final_number;
                    }
    
                return final_number;
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
                document.querySelector(dom.budget_percent).textContent='...';
            })();

        var cntrlAddItem = function () 
            {
                var new_item,input,inc_exp,budget_data;
                input=UICntrl.getInput();
                if(input.description==='' || (Number.isNaN(input.value)))
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
                        
                        if(input.type==='inc')
                            {
                                budgetCtrl.percentage_updater();
                                UICntrl.percent_individual_UIAder();
                            }
                        
                        UICntrl.clearInputFields();
                    }
            
            }
        var cntrlDeleteItem = function (event) 
            {   var IdElement,type,id,SplitIDELE;
                IdElement=event.target.parentNode.parentNode.parentNode.parentNode.id;
                SplitIDELE=IdElement.split('-');
                type=SplitIDELE[0];
                id=parseInt(SplitIDELE[1]);
                UICntrl.deleteUIItem(IdElement);
                budgetCtrl.deleteItem(type,id);
                UICntrl.budget_percent_calculator();
                if(type==='inc')
                    {
                    budgetCtrl.percentage_updater();
                    UICntrl.percent_individual_UIAder();
                    }

            }
        
        return {
                init_event_list : function ()
                        {
                            UICntrl.init_month_year();
                            document.querySelector(dom.add_btn).addEventListener('click',cntrlAddItem);
                            document.addEventListener('keypress', function (event) {
                            if(event.keyCode===13 || event.which===13)
                                {
                                    cntrlAddItem();
                                }
                            })
                            document.querySelector(dom.container).addEventListener('click',cntrlDeleteItem);
                            document.querySelector(dom.add_type).addEventListener('change',UICntrl.change_clr);
                        }

        };
    }
                  
)(budgetController,UIController);


controller.init_event_list(); // to initialize event listeners