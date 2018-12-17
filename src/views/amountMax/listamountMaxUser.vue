
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

            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div class="ordler-list" v-if="doType=='list'">
                      <div class="search-box" style="margin-bottom: 20px;">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                           <!--  <FormItem prop="keyword" style="margin-bottom:0px">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索帐号">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem> -->
                            <FormItem prop="searchDate" style="margin-bottom:0px">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                               
                            </FormItem>

                            <Select v-model="searchData.status" style="width:140px" placeholder="选择审核状态">
                                <Option :value="1">通过</Option>
                                <Option :value="-1">拒绝</Option>
                                <Option :value="2">待审核</Option>
                            </Select>
                    
                           <!--   <Select v-model="searchData.type" style="width:140px" placeholder="选择类型">
                                <Option :value="1">申请限额</Option>
                           
                                <Option :value="2">申请企业会员</Option>
                            </Select> -->
                            <FormItem style="margin-bottom:0px">
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <!-- <Button type="success" icon="android-download" @click="download()">导出</Button> -->
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>


                    </div>

                  <!--   <Button type="primary" :loading="loadBut" style="margin: 10px 0 10px" @click="batchOperation()" >批量操作</Button> -->
                    <Table border :columns="columns" :loading="getLoading" :data="tableData" ></Table>

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
        name: 'listamountMaxUser',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==0||value==1) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                // tableOptions:{
                //     width:"100%"
                // },
                columns: [
                    {
                        title:'会员名称',
                      
                        key:'member_name',
                    },
                    {
                        title:'申请额度',
                        
                        key:'amount_max',
                    },
                    {
                        title: '创建时间',
                       
                        key: 'created'
                    },
                  
                    // {
                    //     title: '身份证正面',
                       
                    //     key: 'front_image'
                    // },
                    // {
                    //     title: '身份证背面',
                        
                    //     key: 'reverse_image'
                    // },
                  



                    {
                        title:'现金花费总额',
                        // width:150,
                        key:'cash_total',
                    },

                     {
                        title:'红积分花费总额',
                       width:150,
                        key:'red_total',
                    },
                    {
                        title:'购物积分花费总额',
                       width:150,
                        key:'shopping_total',
                    },

                    {
                        title: '类型',
                        key: 'type',
                       
                        render: (h, params) => {
                            let tagText="";
                            if(params.row.type==1){
                               tagText="个人申请";
                            };
                            if(params.row.type==2){
                               tagText="申请企业会员";
                            };
                            return h('span', {
                                props: {
                                   
                                    size: 'small'
                                }
                            }, tagText);

                        }
                    },
                   


                    {
                        title: '状态',
                       
                        key: 'status',
                      
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor="default";
                            let tagText="待审核";
                            if(params.row.status==1){
                                tagcolor="green";tagText="通过";
                            };
                            if(params.row.status==-1){
                                tagcolor="red";tagText="拒绝";
                            };
                            if(params.row.status==2){
                                tagcolor="default";tagText="待审核";
                            };
                            // if(params.row.status==2){
                            //     tagcolor="red";tagText="失败";
                            // };
                            return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);

                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        // fixed: 'right',
                        width:150,
                        align: 'center',
                        render: (h, params) => {
                            let deleteButton=h('Button', {
                                props: {

                                    size: 'small',
                                    type:'error'
                                },
                                style:{
                                    marginRight:'10px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.index,-1)
                                    }
                                }
                            }, '拒绝');
                            let eButton=h('Button', {
                                props: {

                                    size: 'small',
                                     type:'success'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.index,1)
                                    }
                                }
                            }, '通过');
                            let dobutton=[];


                            if(params.row.status==2){
                                dobutton.push(deleteButton);
                                dobutton.push(eButton);

                            };
                            // if(params.row.status==0){
                            //     dobutton.push(eButton);

                            // };

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
                    "id": 8,
                    "merchant_id": 1,
                    "merchant_name": "",
                    "bank_id": 1111,
                    "total": "1.0000",
                    "status": 0,
                    "comment": "",
                    "date_added": "2017-11-16 16:00:20",
                    "bank_name": "",
                    "bank_number": ""
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
                if (this.doType=="list") return "商户基本信息管理";
                if (this.doType=="edit") return "编辑商户";
                if (this.doType=="add") return "添加商户";
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
                return !!this.$store.state.Rights[Config.api.management.Reviewmanagement[dotype].MD5()];
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
                if(dotype=="review"){
                    this.changeStatus(dataIndex,index);
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
                    pageSize:this.page.pageSize,
                    type:1
                };
                if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.status!="")postData.status=this.searchData.status;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.amountMax.listamountMax.list,
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
                                // if(data.data.sum_list==undefined){

                                // }else{
                                //     this.Totals.fail=data.data.sum_list.reject_total==null?"0.00":Number(data.data.sum_list.reject_total)/100;
                                //     this.Totals.wait=Number(data.data.sum_list.unreviewed_total)/100;
                                //     this.Totals.success=Number(data.data.sum_list.consent_total)/100;
                                //     this.Totals.sum_total=Number(data.data.sum_list.sum_total)/100;
                                // }



                                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                // //format list data
                                // for(var i=0;i<data.data.list.length;i++){
                                //     data.data.list[i].text=decodeURI(data.data.list[i].text);
                                // }
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

            //批量操作
            batchOperation(){
                let postData=[];
                let postDatas={};
                for (var i=0;i<this.allSelect.length;i++){
                    if(this.allSelect[i].status==0){
                        this.allSelect[i].status=1
                    }else{
                        this.allSelect[i].status=0;
                    }
                    // // console.log(this.allSelect[i].status);
                    // postDatas.id=this.allSelect[i].id;
                    // postDatas.status=this.allSelect[i].status;
                    postData.push({'id':this.allSelect[i].id,'status':this.allSelect[i].status});
                } ;
                let listData={
                    data:postData
                }
                let data={
                    ssid:Cookies.get('ssid'),
                    data:JSON.stringify(listData)
                };

                $.ajax({
                    url: Config.apiRootPath+Config.api.amountMax.listamountMax.review,
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
            changeStatus (index,status) {
              
                let postData={
                    ssid:Cookies.get('ssid'),
                    status:status,
                    id:this.tableData[index].id
                   
                };

                    $.ajax({
                            url: Config.apiRootPath+Config.api.amountMax.listamountMax.review,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                            .done((data)=>{
                                this.saveUpdateStatusLoading=false;
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
                            .fail((xhr,status,error)=>{
                                this.savePassLoading=false;
                                Config.showError({vm:this,data:data,
                                    errorMsg:"服务器通讯失败"
                                });
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

        },
        activated (){
            this.doWhat("list");
        }
    };
</script>
