<!--//退款列表-->
<style scoped>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
</style>
<template>
    <Card>

        <div class="doBox">


                <div class="search-box">
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.keyword" placeholder="输入商家名称与会员名称搜索" style="width: 250px">
                            <Icon type="ios-eye" slot="prepend" style="width: 30px"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
                        </FormItem>
                        <FormItem>
                        	<Select v-model="searchData.order_status" style="width:250px" placeholder="选择订单状态">
                                <Option v-for="item in shipStatus" :value="item.value">{{ item.name }}</Option>
                        	</Select>
                        </FormItem>
                        <FormItem>
                            <ButtonGroup>
                                <Button type="primary" icon="search" @click="search()">搜索</Button>
                                <Button @click="resetSearch()">清空</Button>
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                </div>
                <Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                <div class="page-box">
                    <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                </div>
            </div>
            <Modal v-model="modal2" width="700" v-if="orderState" :closable="false" :styles="{top: '10px'}" @on-cancel="del">
                <p slot="header" style="color:black;font-weight:bold;text-align:left;font-size: 18px">
                    <!--<Icon type="information-circled"></Icon>-->
                    <span>订单详情</span>
                </p>
                <div>
                    <Card>
                        <p slot="title">会员信息</p>
                        <Table :columns="columnsOrder" :data="orderDetail"></Table>
                    </Card>

                    <div style="margin-top: 20px">
                        <Card style="margin-top: 20px">
                            <p slot="title">订单状态</p>
                            <Alert type="error" v-if="orderDetails.order_status>=5">订单状态：
                                <span style="font-size: 16px" v-if="orderDetails.order_status==5">退款中</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==6">已退款</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==7">已完成</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==8">待评价</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==9">订单已取消</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==10">确认收货</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==11">已评价</span>
                                <span style="font-size: 16px" v-if="orderDetails.order_status==12">已删除</span>
                            </Alert>

                            <Steps :current="orderDetails.order_status-1" v-if="orderDetails.order_status<5" size="small">
                                <Step title="待支付"></Step>
                                <Step title="已支付"></Step>
                                <Step title="待发货"></Step>
                                <Step title="已发货"></Step>
                                <!--<Step title="退款中"></Step>-->
                                <!--<Step title="已退款"></Step>-->
                                <!--<Step title="已完成"></Step>-->
                                <!--<Step title="待评价"></Step>-->
                                <!--<Step title="取消订单"></Step>-->
                                <!--<Step title="确认收货"></Step>-->
                                <!--<Step title="已评价"></Step>-->
                                <!--<Step title="已删除"></Step>-->
                            </Steps>
                        </Card>
                    </div>

                    <div style="margin-top: 20px">
                        <Card style="margin-top: 20px">
                            <p slot="title">商品信息</p>
                            <Table :columns="columnsShoping" :data="orderShoping"></Table>
                        </Card>
                    </div>
                    <div style="margin-top: 20px">
                        <Card>

                            <p slot="title">快递信息</p>
                            <Table :columns="columnsExpressage" :data="orderDetail"></Table>
                        </Card>
                    </div>

                    <div style="margin-top: 20px">
                        <Row :gutter="50">
                            <Col span="12">
                                <Card>
                                    <p slot="title">订单信息</p>
                                     <p>订单总金额(元)：<span style="font-size: 16px;color: red">￥{{orderDetails.total/100}}</span></p>

                                    <p>支付方式：<span style="font-size: 16px">{{orderDetails.payment_method==""?"待支付":paytype[orderDetails.payment_method]}}</span></p>

                                </Card>
                            </Col>
                            <Col span="12">
                            <Card>
                                <p slot="title">其他信息</p>
                                <p>备注：
                                    <span style="font-size: 16px">{{orderDetails.comment}}</span></p>
                                <p>
                                    新增时间：<span style="font-size: 16px">{{orderDetails.date_added}}</span>
                                </p>
                                <p>
                                    修改时间：<span style="font-size: 16px">{{orderDetails.date_modified}}</span>
                                </p>

                            </Card>
                            </Col>


                        </Row>

                    </div>


                </div>
                <div slot="footer">
                    <Button type="error" size="large" long  @click="del">关闭</Button>
                </div>
            </Modal>
            <Modal title="物流详情" v-model="modal10" width="500" class-name="vertical-center-modal" @on-cancel="cancel">
<template>
    <Timeline>
        <Timeline-item v-for="item in recordStatus">
            <p class="time">{{item.AcceptTime}}</p>
            <p class="content">{{item.AcceptStation}}</p>
        </Timeline-item>
    </Timeline>
</template>
        <div slot="footer"></div>
</Modal>

    </Card>
</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    export default {
        name: 'Ordermanagement',
        data(){
            return{
                modal2 : false,
                orderState:false,
                modal10:false,
                recordStatus:[],
                paytype:["未知","购物积分","红积分","支付宝","微信","银行卡"],
                //订单详情
              columnsExpressage:[
                 {
                      title:'邮寄方式',
                      key:'shipping_method'
                 },
                 {
                        title: '快递名称',
                        align:'center',
                        key: 'expressage_name'
                 },
                {
                  title:'快递单号',
                  key:'shipping_express_no'
                },
                {
                  title:'快递编号',
                  key:'shipping_express_code'
                },
                {
                  title:'快递费用',
                  key:'shipping_method'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        let editButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showShip(params.row.shipping_express_code,params.row.shipping_express_no);
                                    }
                                }
                            }, '查看物流');
                        let dobutton=[];
                        if(params.row.shipping_express_no){
                        	dobutton.push(editButton);
                        }
                        return h('div', dobutton);
                    }
                }
              ],
                columnsOrder:[
                  {
                    title:'会员姓名',
                    key:'member_name',
                  },
                  {
                    title:'会员电话',
                    key:'member_name',
                  },
                  {
                    title:'收货人',
                    key:'shipping_member_name',
                  },
                  {
                    title:'收货人联系电话',
                    key:'shipping_mobile',
                  },
                  {
                    title:'收货地址1',
                    key:'shipping_address_1',
                  },
                  {
                    title:'收货地址2',
                    key:'shipping_address_2',
                  }

                ],
                //商品
                  columnsShoping:[
                    {
                      title:'订单ID',
                      key:'order_id',
                    },
                    {
                      title:'商品名称',
                      key:'name',
                    },
                    {
                      title:'数量',
                      key:'quantity',
                    },
                    {
                      title:'商品单价',
                      key:'price',
                    },
                    {
                      title:'商品小计',
                      key:'total',
                    }

                  ],
                columns: [
                    {
                        title: '订单编号',
                        // width: "10%",
                        key: 'order_no'
                    },
                    {
                        title: ' 商家名称 ',
                        key: 'merchant_name'
                    },
                    {
                        title: '用户名称',
                        key: 'member_name'
                    },
                    {
                        title: '快递单号',
                        key: 'shipping_express_no'
                    },
                    {
                        title: '快递名称',
                        align:'center',
                        key: 'expressage_name'
                    },
                    {
                        title: '总价格',
                        key: 'total',
                        render: (h, params) => {
                            return h('span', {}, Util.fmoney(Util.numberCarry(params.row.total,100,4),4));
                        }
                    },
                    {
                        title: ' 新增时间 ',
                        key: 'date_added'
                    },
                   {
                        title: '支付方式',
                        key: 'payment_method',
                        render: (h, params) => {

                            let tagcolor="default";
                            let tagText="待支付";
                            if(params.row.payment_method==1){
                                tagcolor="green";tagText="购物积分";
                            };
                            if(params.row.payment_method==2){
                                tagcolor="red";tagText="红积分";
                            };
                            if(params.row.payment_method==3){
                                tagcolor="green";tagText="支付宝";
                            };
                            if(params.row.payment_method==4){
                                tagcolor="red";tagText="微信";
                            };
                            if(params.row.payment_method==5){
                                tagcolor="green";tagText="银行卡";
                            }
                          
                            return h('span', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);

                        }
                    },

                    {
                        title: '订单状态',
                        key: 'order_status',
                        render: (h, params) => {

                            let tagcolor="default";
                            let tagText="申请中";
                            if(params.row.order_status==1){
                                tagcolor="green";tagText="待支付";
                            };
                            if(params.row.order_status==2){
                                tagcolor="red";tagText="已支付";
                            };
                            if(params.row.order_status==3){
                                tagcolor="green";tagText="待发货";
                            };
                            if(params.row.order_status==4){
                                tagcolor="red";tagText="已发货";
                            };
                            if(params.row.order_status==5){
                                tagcolor="green";tagText="退款中";
                            };
                            if(params.row.order_status==6){
                                tagcolor="red";tagText="已退款";
                            };
                            if(params.row.order_status==7){
                                tagcolor="green";tagText="已完成";
                            };
                            if(params.row.order_status==8){
                                tagcolor="red";tagText="待评价";
                            };
                            if(params.row.order_status==9){
                                tagcolor="green";tagText="取消订单";
                            };
                            if(params.row.order_status==10){
                                tagcolor="red";tagText="确认收货";
                            };
                            if(params.row.order_status==11){
                                tagcolor="green";tagText="已评价";
                            };
                            if(params.row.order_status==12){
                                tagcolor="red";tagText="已删除";
                            };
                            return h('span', {
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
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                      return h('Button', {
                          props: {
                            type: 'primary',
                            size: 'small'
                          },
                          style: {
                            marginRight: '5px'
                          },
                          on: {
                            click: () => {
                              this.show(params.row.id)
                            }
                          }
                        }, '查看')



                    }
                  }
                ],
                saveType: "new",
                tableData: [],
                page: {
                    dataCount:0,
                    pageCount:0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts:[10,20,50,100]
                },
                currentData: {
                    "id":0,
                    "order_no":"",
                    "merchant_id":0,
                    "member_name":"",
                    "total_score":1,
                    "status":1,
                    "date_added":"",
                    "cash":0,
                    "score":0
                },
                shipStatus:[
                	{'value':'1','name':'待支付'},{'value':'2','name':'已支付'},{'value':'3','name':'待发货'},{'value':'4','name':'已发货'},{'value':'5','name':'退款中'},
                	{'value':'6','name':'已退款'},{'value':'7','name':'已完成'},{'value':'8','name':'待评价'},{'value':'9','name':'取消订单'},{'value':'10','name':'确认收货'},
               		 {'value':'11','name':'已评价'},{'value':'12','name':'已删除'}
                ],
                getLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    order_status:""
                },
                searchValidata: {},
                orderDetail:[],
                orderShoping:[],
                orderDetails:{}
            };
        },
        methods: {
            doWhat(){
                this.init();
            },
            cancel(){
            	this.modal2=true;
            	this.modal10=false;
            },

            //查看订单
            del(){
              this.modal2=false;
            },
            show (index){

              let postData={
                ssid:Cookies.get('ssid'),
                order_id:index
              };
              $.ajax({
                url:Config.apiRootPath+Config.api.management.Ordermanagement.view,
                type: 'POST',
                dataType: 'json',
                data: postData
              })
                .done((data)=>{
                  // getBankCardList
                  if(!!data){
                    if(data.code==0){
                      let item=data.data;
                      let newListData=[];
                      //快递
                        newListData.push(
                          {
                            member_name: item.member_name,
                            mobile: item.mobile,
                            shipping_member_name: item.shipping_member_name,
                            shipping_mobile: item.shipping_mobile,
                            mobile: item.mobile,
                            shipping_address_1:item.shipping_province_name+" "+item.shipping_city_name+" "+item.shipping_district_name  +" "+item.shipping_address_1,
                            shipping_address_2:item.shipping_address_2,

                            shipping_method:item.shipping_method,
                            shipping_express_no:item.shipping_express_no,
                            shipping_express_code:item.shipping_express_code,
                            shipping_method:item.shipping_method,
                            expressage_name:item.expressage_name
                          }
                        );

                      this.orderDetail=newListData;
                      this.orderShoping=data.data.product;
                       item.comment=decodeURI(item.comment);
                      this.orderDetails=item;
                      this.orderState=true;
                    }else{
                      this.$Message.error(data.message);
                      if(data.code==Config.errorCode.runOut.num){
                        this.$store.commit('logout',this);
                      }
                    }
                  }else{
                    this.$Message.error("获取订单详情失败 "+status);
                  }
                })
                .fail((xhr,status,error)=>{
                  this.$Message.error("获取订单详情失败 "+status);
                });
              this.modal2=true;
            },
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search();
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            search () {
                console.log(JSON.stringify(this.searchData));
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                }
                this.init();
            },
            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0,
                    order_status:""
                };
                this.page.pageNumber=1;
                this.dataReady+=1;
                this.init();
            },

            init () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                if(this.searchData.order_status!="")postData.orderStatus=this.searchData.order_status;
                $.ajax({
                    url:Config.apiRootPath+Config.api.management.Ordermanagement.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // getBankCardList
                        if(!!data){
                            if(data.code==0){
                                this.page.dataCount=data.data.count;
                                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                for(var i=0;i<data.data.list.length;i++){
                                    data.data.list[i].comment=decodeURI(data.data.list[i].comment);
                                }
                                this.tableData=data.data.list;
                            }else{
                                this.$Message.error(data.message);
                                if(data.code==Config.errorCode.runOut.num){
                                    this.$store.commit('logout',this);
                                }
                            }
                        }else{
                            this.$Message.error("获取订单列表失败 "+status);
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.$Message.error("获取订单列表失败 "+status);
                    });
            },
            showShip(sTit,sCode){
                let postData={
                    ssid:Cookies.get('ssid'),
                    ShipperCode:sTit,
                    LogisticCode:sCode
                };
            	this.modal10=true;
            	this.modal2=false;
                $.ajax({
                    url:Config.apiRootPath+Config.api.management.Ordermanagement.queryShip,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // getBankCardList
                        if(!!data){
                        	console.log(data);
                            if(data.code==0){
                            	if(data.data.Traces.length>0){
                            		this.recordStatus=data.data.Traces;
                            	}else{
                            		this.recordStatus.push({"AcceptStation": "暂无物流信息","AcceptTime": " "});
                            	}
                            	
                            }else{
                                this.$Message.error(data.message);
                                if(data.code==Config.errorCode.runOut.num){
                                    this.$store.commit('logout',this);
                                }
                            }
                        }else{
                            this.$Message.error("获取详情失败 ");
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.$Message.error("获取详情失败 ");
                    });
            }
        },
        mounted () {
            this.doWhat();
        },
        activated (){
            // this.doWhat();
        }
    };
</script>
