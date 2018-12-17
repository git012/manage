
 <style lang="less">
    @import "../../styles/common.less";
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .ivu-tree{width: 600px}
</style>
<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP"> 
                积分审核
            </p>
            <div class="doBox">

                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form 
                        ref="currentData"
                        :model="currentData" 
                        :label-width="100" 
                        label-position="right"
                        :rules="currentDataValidate"
                    >
                        <FormItem label="用户名：" prop="memberName">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.memberName" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="期数" prop="rank">
                            <!-- <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.rank" ></Input>
                            </div> -->
                            <Select v-model="currentData.rank" style="width:204px" placeholder="选择期数">
                                    <Option value="12">12</Option>
                                    <Option value="24">24</Option>
                                    <Option value="36">36</Option>
                                </Select>
                        </FormItem>
                        <FormItem label="金额：" prop="amount" >
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.amount" ></Input>
                            </div>
                        </FormItem>
                        <div>
                            <Button type="text" style="width: 100px;" @click="doWhat('list')">取消</Button>
                            <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
                        </div>

                    </Form>    
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                      <div class="search-box" style="margin-bottom: 20px;">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                            <FormItem prop="keyword" style="margin-bottom:0px">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入姓名搜索">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem style="margin-bottom:0px">
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                    <Table border :columns="columns" :loading="getLoading" :data="tableData" @on-select="OnSelect" @on-select-all="allOnSelect" @on-selection-change="selectionchange"></Table>

                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import MD5 from '../../libs/md5';
    export default {
        name: 'Lists',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==0||value==1) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
        const valideUserGroupId = (rule, value, callback) => {
                if (value>0) {
                    callback();
                } else {
                    callback(new Error('请选择部门'));
                }
            };
        const validePhone = (rule, value, callback) => {
            var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的金额'));
            } else {
                callback();
            }
        };
            return {
                // tableOptions:{
                //     width:"100%"
                // },
                // 
                totalAmount:'',
                totalScore:'',
                getLists:[],
            columns: [
                {
                    title: 'ID',
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '代理ID',
                    align: 'center',
                    key: 'agent_id'
                },
                {
                    title: '申请人姓名',
                    align: 'center',
                    key: 'member_name',
                },
               
                {
                    title: '申请时间',
                    align: 'center',
                    key: 'date_added'
                },
                {
                    title: '提现银行（银行名称）',
                    align: 'center',
                    key: 'bank_name'
                },
                {
                    title: '银行卡号',
                    align: 'center',
                    key: 'bank_number'
                },
                {
                    title: '开户行',
                    align: 'center',
                    key: 'opening_bank'
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'total'
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        let tagText="";
                        if(params.row.status==0){
                           tagText="申请中";
                        };
                        if(params.row.status==1){
                           tagText="提现成功";
                        };
                        if(params.row.status==2){
                           tagText="提现失败";
                        };
                        return h('span', {
                            props: {
                                size: 'small',
                            }
                        }, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 220,
                    align: 'center',
                    render: (h, params) => {
                            let deleteButton=h('Button', {
                                props: {
                                    size: 'small',
                                    type:'default'
                                },
                                style:{
                                    marginRight:'10px'
                                }
                            }, '审核通过');
                            let eButton=h('Button', {
                                props: {
                                    size: 'small',
                                     type:'success'
                                },
                                style:{
                                    marginRight:'10px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.row.id,1)
                                    }
                                }
                            }, '通过');
                             let dButton=h('Button', {
                                props: {
                                    size: 'small',
                                     type:'error'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("refuse",params.row.id,2)
                                    }
                                }
                            }, '拒绝');
                            let dobutton=[];
                            if(params.row.status==0){
                                // dobutton.push(deleteButton);
                                dobutton.push(eButton); 
                                dobutton.push(dButton); 
                            }else if((params.row.status==1)){
//                               dobutton.push(deleteButton); 
                            }
                            return h('div', dobutton);
                    }
                }            ],                
                saveType: "new",
                doType:"list",
                switching:false,
                tableData: [],
                merchantTypeData: [],
                areaData:{
                    areaDataReady:3,
                    province:[],
                    citys:[],
                    district:[]
                },
                shipStatus:["待审核","审核成功","审核失败"],
                Totals :{
                    wait: "0.00",
                    fail: '0.00',
                    success: '0.00',
                    sum_total:'0.00'
                },
                page: {
                    dataCount:0,
                    pageCount:0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts:[10,20,50,100]
                },
                dataReady:0,
                currentData: {},
                defaultData:{
                    amount:"",
                    rank:"",
                    memberName:"",
                },
                updateStatusForm: {},
                updateStatusValidate: {
                    status: [
                        { validator: valideCashStatus, message: '请选择审核结果', trigger: 'blur' }
                    ]
                },
                oldPassError: '',
                allSelect:[],
                loadBut:false,
                updateStatus: false, // 修改密码模态框显示
                updateRefuse:false,
                saveUpdateStatusLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    shipStatus:'',
                    endDate:"",
                    status:"",
                    type:"",
                },
                addDataValidate: {
                amount: [
                    { required: true, message: '请输入金额'},
                    { validator: validePhone }
                ],
                memberName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                rank: [
                    { required: true, message: '请选择期数' },
                ],
            },
                searchValidata: {}
            };
        },
        computed : {
            getLoading () {
                return !(this.dataReady==0);
            },
            areaDataReady () {
                return !(this.areaData.areaDataReady==0);
            },
            doName () {
                if (this.doType=="list") return "兑付方案";
                if (this.doType=="edit") return "编辑商户";
                if (this.doType=="add") return "添加";
                return "商户详情";
            },
            currentDataValidate () {
                if(this.doType=="add")return this.addDataValidate;
                return this.editDataValidate;
            },
            hasDataChange () {
                return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
            }
        },
        methods: {
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            OnSelect(event){
                console.log(event);
                 this.allSelect=event
            },
            selectionchange(event){
                console.log(event);
                this.allSelect=event
            },
            allOnSelect(event){
                console.log(event);
                
                this.allSelect=event
                console.log(this.allSelect);
            },
            saveUpdateStatus(){
            	this.updateRefuse=true;
            },
            //controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.agents.agents_depositList.depositList.MD5()];
            },
            doWhat (dotype,dataIndex,index) {
                if(!this.checkPower(dotype)){
                    this.$Message.warning("对不起，您没有此操作权限！");
                    return;
                }
                this.switching=true;
                if(dotype=="add"){
                    this.resetCurrentData();
                    this.doType="add";
                };
                if(dotype=="edit"){
                    this.showEdit(dataIndex);
                    this.doType="edit";
                };
                if(dotype=="delete"){
                    this.delete(dataIndex);
                };
                if(dotype=="review"){//审核
                    this.changeStatus(dataIndex,index);
                };
                if(dotype=="refuse"){//拒绝
                   this.refuseStatus(dataIndex,index);
                };                
                if(dotype=="list"){
                    this.resetCurrentData();
                    this.dataReady+=1;
                    this.init();
                    this.doType="list";
                };
                this.switching=false;
            },
            view (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.doType="view";
            },
            showEdit (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.currentData.userewm=Config.apiRootPath+Config.api.public.ewm+"&merchantId="+this.currentData.merchantId;
                this.setCity(this.currentData.merchantProvinceId,true);
                this.setDistrict(this.currentData.merchantCityId,true);
                this.doType="edit";
            },
            //comm
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                }
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.doWhat("list");
            },
            saveEdit () {
                this.$refs['currentData'].validate((valid) => {
                   if (valid){
                        let postData={
                            ssid:Cookies.get('ssid'),
                            amount:this.currentData.amount,
                            rank:this.currentData.rank,
                            memberName:this.currentData.memberName
                        };
                        $.ajax({
                            url: Config.apiRootPath+Config.api.integral.List.add,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                        .done((data)=>{
                            this.dataReady--;
                            // getList
                            if(!!data){
                                if(data.code==0){
                                    this.dataReady++;
                                    // this.tableData=data.data.list;
                                     this.$Message.success("添加成功");
                                     this.doWhat("list");
                                }else{
                                    Config.showError({vm:this,data:data,
                                        errorMsg:""
                                    });
                                }
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:"请求失败"
                                });
                            }
                        })
                    }
                })
            },
            //list
            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };
                this.page.pageNumber=1;
                this.dataReady+=1;
                this.init();
            },
            init () {
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.search=this.searchData.keyword;
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.status!="")postData.status=this.searchData.status;
                if(this.searchData.shipStatus!="")postData.merchantId=this.searchData.shipStatus;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.agents.agents_depositList.depositList,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){                              
                                this.tableData=data.data.list;
                                  this.page.dataCount=data.data.count;
                                this.totalAmount=data.data.totalAmount==null?0:Number(data.data.totalAmount).toFixed(2);

                                 this.totalScore=data.data.totalScore==null?0:Number(data.data.totalScore).toFixed(2);
                                for (var i = 0; i < this.tableData.length; i++) { 
                                    if (this.tableData[i].status==1||this.tableData[i].status==-1) { 
                                        this.tableData[i]._disabled = true; 
                                    } 
                                }

                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },
             getListss () {
                let postData={
                    ssid:Cookies.get('ssid'),
                };
              
                $.ajax({
                    url: Config.apiRootPath+Config.api.integral.List.lists,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                     
                        // getList
                        if(!!data){
                            if(data.code==0){                              
                                this.getLists=data.data;
                               

                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                      
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },

              //批量操作
            batchOperation(){
                let postData=[];
                console.log(this.allSelect,'wwww');
                for (var i=0;i<this.allSelect.length;i++){
                    if(this.allSelect[i].status==0){
                        this.allSelect[i].status=1
                    }else{
                        this.allSelect[i].status=0;
                    }
                  
                    postData.push(this.allSelect[i].id);
                }
                console.log(postData);
                let data={
                    ssid:Cookies.get('ssid'),
                    // data:JSON.stringify(listData)
                    ids:JSON.stringify({"ids":postData}),
                    status:1
                };

                $.ajax({
                     url: Config.apiRootPath+Config.api.integral.List.review,
                    type: 'POST',
                    dataType: 'json',
                    data: data
                })
                    .done((data)=>{

                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("操作成功！");
                                let newListData=$.extend(true, [], this.tableData);
                                newListData[this.updateStatusForm.tableIndex]=this.updateStatusForm;
                                this.updateStatusForm={};
                                this.tableData=newListData;
                                this.updateStatus = false;
                                this.doWhat("list");
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{

                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },
            //edit password
            changeStatus (dataIndex,index) {
                let data={
                    ssid:Cookies.get('ssid'),
                    id:dataIndex,
                    status:index
                };
                    this.$Modal.confirm({
                        title: '提现审核',
                        content: '<p>确定同意提现申请？</p>',
                        onOk: () => {
                            $.ajax({
                                url: Config.apiRootPath+Config.api.agents.agents_depositList.depositListButton,
                                type: 'POST',
                                dataType: 'json',
                                data: data
                            })
                            .done((data)=>{
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.$Message.success("操作成功！");
                                       this.doWhat("list");
                                    }else{
                                        Config.showError({vm:this,data:data,
                                            errorMsg:""
                                        });
                                    }
                                }else{
                                    Config.showError({vm:this,data:data,
                                        errorMsg:"请求失败"
                                    });
                                }
                            })
                            .fail((xhr,error)=>{
                                this.savePassLoading=false;
                                Config.showError({vm:this,data:data,
                                    errorMsg:"服务器通讯失败"
                                });
                            });
                        },
                        onCancel: () => {
                            this.$Message.info('放弃审核');
                        }
                    });
            },
            refuseStatus (dataIndex,index) {
                let data={
                    ssid:Cookies.get('ssid'),
                    id:dataIndex,
                    status:index
                };
                    this.$Modal.confirm({
                        title: '提现审核',
                        content: '<p>拒绝此提现申请？</p>',
                        onOk: () => {
                            $.ajax({
                                url: Config.apiRootPath+Config.api.agents.agents_depositList.depositListButton,
                                type: 'POST',
                                dataType: 'json',
                                data: data
                            })
                            .done((data)=>{
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.$Message.success("操作成功！");
                                       this.doWhat("list");
                                    }else{
                                        Config.showError({vm:this,data:data,
                                            errorMsg:""
                                        });
                                    }
                                }else{
                                    Config.showError({vm:this,data:data,
                                        errorMsg:"请求失败"
                                    });
                                }
                            })
                            .fail((xhr,error)=>{
                                this.savePassLoading=false;
                                Config.showError({vm:this,data:data,
                                    errorMsg:"服务器通讯失败"
                                });
                            });
                        },
                        onCancel: () => {
                            this.$Message.info('放弃审核');
                        }
                    });
            },            
            handleSelectAll(status){
                this.$refs.selection.selectAll(status);
            },
            cancelUpdateStatus () {
                this.updateRefuseForm={};
                this.updateRefuse = false;
            },
        },
        mounted () {
      	this.doWhat("list");
        },
        activated (){
            this.doWhat("list");
            this.getListss();
        }
    };
</script>