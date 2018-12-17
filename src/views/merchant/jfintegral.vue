
<style lang="less">
    @import './cash.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small"
                        v-if="checkPower('list')&&doType!='list'"
                        @click="doWhat('list')" >返回列表
                </Button>

            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名用户名">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择分发状态">
                                <Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>
                            </Select>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                        <!--<div class="" style="float: right;vertical-align: top;position: relative;top: -50px">合计：</div>-->
                    </div>
                    <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
            <Modal v-model="updateStatus" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">提现审核</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">
                    <FormItem label="会员名称：" style="margin-bottom:0px">
                        {{updateStatusForm.member_name}}
                    </FormItem>
                    <FormItem label="银行名称：" style="margin-bottom:0px">
                        {{updateStatusForm.bank_name}}
                    </FormItem>
                    <FormItem label="开户行：" style="margin-bottom:0px">
                        {{updateStatusForm.opening_bank}}
                    </FormItem>
                    <FormItem label="开户名：" style="margin-bottom:0px">
                        {{updateStatusForm.username}}
                    </FormItem>
                    <FormItem label="银行卡卡号：" style="margin-bottom:0px">
                        {{updateStatusForm.bank_number}}
                    </FormItem>
                    <FormItem label="审核状态：" prop="status">
                        <RadioGroup v-model="updateStatusForm.status">
                            <Radio label="1">
                                <span>通过</span>
                            </Radio>
                            <Radio label="2">
                                <span>拒绝</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelUpdateStatus">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';


    export default {
        name: 'merchant_jfintegral',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==1||value==2) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                tableOptions:{
                    width:"100%"
                },
                columns: [
                    {
                        title: 'ID',
                        // width: "60",
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '商户名',
                        // width: "130",
                        key: 'name'
                    },
                    {
                        title: '流水号',
                        // width: "130",
                        key: 'serial_number'
                    },
                    {
                        title: '分发积分总数',
                        // width: "130",
                        key: 'total'
                    },
                    {
                        title: '云联惠ID',
                        key: 'yun_account'
                    },
                    {
                        title: '商户创建分发时间',
                        key: 'date_added'
                    },
                    {
                        title: '分发金额',
                        align: 'right',
                        key: 'content',
                        render: (h, params) => {
                            return h('span', {}, Util.fmoney(Util.numberCarry(params.row.total,100,4),6));
                        }
                    },
                    {
                        title: '备注',
                        // width: "130",
                        align: 'center',
                        key: 'comment'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        // width: "100",
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor="default";
                            let tagText="待处理";
                            if(params.row.status==1){
                                tagcolor="green";tagText="分发成功";
                            };
                            if(params.row.status==0){
                                tagcolor="default";tagText="待处理";
                            };
                            if(params.row.status==2){
                                tagcolor="red";tagText="分发失败";
                            };
                            return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);

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

                page: {
                    dataCount:0,
                    pageCount:0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts:[10,20,50,100]
                },
                shipStatus:["待分发","分发成功","分发失败"],
                Totals :{
                    wait: "0.00",
                    fail: '0.00',
                    success: '0.00',
                    sum_total:'0.00'
                },
                dataReady:0,
                currentData: {},
                defaultData:{
                    "id": 8,
                    "member_id": 1,
                    "member_name": "",
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
                updateStatus: false, // 修改密码模态框显示
                saveUpdateStatusLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
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
                if (this.doType=="list") return "会员基本信息管理";
                if (this.doType=="edit") return "编辑会员";
                if (this.doType=="add") return "添加会员";
                return "会员详情";
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
            //controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.user.user_cash[dotype].MD5()];
            },
            doWhat (dotype,dataIndex) {
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
                    this.changeStatus(dataIndex);
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
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
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
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                };
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.doWhat("list");
            },
            init () {
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    "type":2,
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.name=Util.trim(this.searchData.keyword);
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.shipStatus>=0)postData.status=this.searchData.shipStatus;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.merchant.merchant_jfintegral.list,
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
                                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
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
            getMerchantType () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                $.ajax({
                    url: Config.apiRootPath+Config.api.public.merchantType,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // getBankCardList
                        this.dataReady--;
                        if(!!data){
                            if(data.code==0){
                                let typelist=[];
                                for (let item in data.data){
                                    typelist.push({ value: parseInt(item) ,label: data.data[item]});
                                }
                                this.merchantTypeData=typelist;
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
                this.updateStatusForm=$.extend(true, {}, this.tableData[index]);
                this.updateStatusForm.tableIndex=index;
                this.updateStatus = true;
            },
            cancelUpdateStatus () {
                this.updateStatusForm={};
                this.updateStatus = false;
            },
            saveUpdateStatus () {
                this.$refs['updateStatusForm'].validate((valid) => {
                    if (valid) {

                        this.saveUpdateStatusLoading = true;
                        let postData={
                            ssid:Cookies.get('ssid'),
                            id:this.updateStatusForm.id,
                            status:this.updateStatusForm.status
                        };

                        $.ajax({
                            url: Config.apiRootPath+Config.api.user.user_cash.review,
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
                                        let newListData=$.extend(true, [], this.tableData);
                                        newListData[this.updateStatusForm.tableIndex]=this.updateStatusForm;
                                        this.updateStatusForm={};
                                        this.tableData=newListData;
                                        this.updateStatus = false;
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
                    }
                })
            },
            //delete
            delete (index) {

                if(!this.tableData[index].id)return;
                //银行选择
                let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id,
                    status:0
                });
                $.ajax({
                    url: Config.apiRootPath+Config.api.user.user_cash.delete,
                    type: 'POST',
                    dataType: 'json',
                    data: postData()
                })
                    .done((data)=>{
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("删除成功!");
                                this.tableData.splice(index, 1);
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
            }
        },
        mounted () {
        },
        activated (){
            this.doWhat("list");
        }
    };
</script>
