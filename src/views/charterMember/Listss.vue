/*创始会员*/
<style lang="less">
    /*@import './merchant/merchant.less';*/
    /*.page-box{padding-top: 16px; text-align: center }*/
    /*.add-btu{ position: relative; float: right}*/
    /*.ivu-card-head p.hasButtonP{ overflow:visible;}*/
    /*.doBox{ position:relative}*/
    /*.small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}*/
    /*.small_table table th{ text-align:center}*/
    /*.shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}*/
    /*.shop-ewm img{width:180px; height: auto; border:1px solid #dededf}*/
</style>
<template>
    <div>
        <Card>
              <p slot="title" class="hasButtonP">
               
                   {{doName}}
                   <Button type="primary" class="add-btu" size="small" 
                        v-if="doType=='list'" 
                        @click="doWhat('add')" >添加
                    </Button>
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
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索帐号">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem style="margin-bottom:0px">
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                   
                    </div>
                    <Table border :columns="columns" :loading="getLoading" :data="tableData" ></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
        </Card>
        <Modal
        v-model="modal1"
        title="创始会员新增积分"
    >
        <p style="height:30px"></p>
        <p> <span>新增金额：</span><Input v-model="newamount" style="width:70%" ></Input><span style="color: red">(单位：元)</span></p>
          <p style="height:30px"></p>
          <div slot="footer">
   	<Button type="text" size="large" @click="cancel">取消</Button>
   	<Button type="primary" size="large" @click="addSave">确定</Button>
   </div>

    </Modal>
    </div>
</template>
<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import MD5 from '../../libs/md5';
    export default {
        name: 'List',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==0||value==1) {
                    callback();
                } else {
                    callback(new Error(rule.message));
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
               modal1:false, 
               newamount:null,
               member_id:null,
                columns: [
                 
                    { 
                        title: '会员id',
                        key: 'member_id'
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                   
                    {
                        title: '创始白积分',
                        key: 'white_score',
                        render: (h, params) => {
                            return h('span', {}, Util.fmoney(Util.numberCarry(params.row.white_score,100,4),4));
                        }
                    },
                    {
                        title: '创始红积分',
                        key: 'red_score',
                        render: (h, params) => {
                            return h('span', {}, Util.fmoney(Util.numberCarry(params.row.red_score,100,4),4));
                        }
                    }, 
                    {
                        title: '贡献值',
                        key: 'contribution',
                    },
                    {
                    title: '操作',
                    key: 'id',
                    // width: "9%",
                    align: 'center',
                    render: (h, params) => {

                        let settlementButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '新增积分');

                        let dobutton=[];

                        // if(params.row.status==2&&this.checkPower("fahuo"))dobutton.push(settlementButton);
                        dobutton.push(settlementButton)
                        return h('div', dobutton);
                    }
                }
                 
                ],
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
                saveUpdateStatusLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
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
                if (this.doType=="list") return "创始会员";
                if (this.doType=="edit") return "编辑商户";
                if (this.doType=="add") return "添加创始会员白积分";
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
            rankclick:function (e) {
                console.log(e);
                if (e==12) {
                    this.currentData.ranks=1
                }else if(e==24){
                    this.currentData.ranks=2
                }else{
                    this.currentData.ranks=3
                }
                console.log(this.currentData.ranks);
                // body...
            },
            OnSelect(event){
                // console.log(event);
            },
            selectionchange(event){
                // console.log(event);
            },
            allOnSelect(event){
                // console.log(event);
                this.allSelect=event
            },
            //controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.charterMember.List[dotype].MD5()];
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

                    this.changeStatus(dataIndex);
                };
                if(dotype=="list"){
                    this.resetCurrentData();
                    this.dataReady+=1;
                    this.init();
                    console.log('ssss');
                    this.doType="list";
                };
                this.switching=false;
            },
            view (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.doType="view";
            },
            showEdit (index) {
                this.modal1=true, 
               console.log(this.tableData[index]);
               this.member_id= this.tableData[index].member_id
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
                            score:Number(this.currentData.amount),
                           
                            name:this.currentData.memberName
                        };
                        $.ajax({
                            url: Config.apiRootPath+Config.api.charterMember.List.add,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                        .done((data)=>{
                            this.dataReady--;
                            // getList
                            if(!!data){
                                if(data.code==0){
                                    this.dataReady=0
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
            cancel(){
                this.modal1=false
                this.newamount=null
            },
             addSave () {

                  var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if (!re.test(this.newamount)) {
                        // callback(new Error('请输入正确格式的金额'));
                       
                         this.$Message.error('请输入正确格式的金额');
                        this.modal1=true
                    } else {

                         let postData={
                            ssid:Cookies.get('ssid'),
                            memberId:this.member_id,
                            score:Number(this.newamount)
                        };
                        $.ajax({
                            url: Config.apiRootPath+Config.api.charterMember.List.newAdd,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                        .done((data)=>{
                            this.dataReady--;
                            // getList
                            if(!!data){
                                if(data.code==0){
                                    this.dataReady=0
                                   // this.tableData=data.data.list;
                                     this.$Message.success("新增添加成功");
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
                console.log(23);
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.name=this.searchData.keyword;
              
                $.ajax({
                    url: Config.apiRootPath+Config.api.charterMember.List.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                this.page.dataCount=data.data.count;  
                                this.tableData=data.data.list;
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
           
            //edit password
            changeStatus (index) {
        
                    this.$Modal.confirm({
                        title: '兑付方案审核',
                        content: '<p>确定通过兑付方案申请？</p>',
                        onOk: () => {
                          let postData={
                                ssid:Cookies.get('ssid'),
                                id:index,
                                status:1,
                              
                            };
                            $.ajax({
                                url: Config.apiRootPath+Config.api.charterMember.List.review,
                                type: 'POST',
                                dataType: 'json',
                                data: postData
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
                this.updateStatusForm={};
                this.updateStatus = false;
            },
        },
        mounted () {
             this.doWhat("list");
        },
        activated (){
            this.doWhat("list");
            // this.getList();
        }
    };
</script>