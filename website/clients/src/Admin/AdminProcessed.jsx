import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../Helpers/AuthContext";
import { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Button,
  Layout,
  Menu,
  theme,
  Breadcrumb,
  Tooltip,
  Table,
  Pagination,
  Modal,
  Popover,
} from "antd";
import {
  HistoryOutlined,
  OrderedListOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  LogoutOutlined,
  CheckOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../Admin/AdminPanel.css";

function AdminProcessed() {
  const { Content, Sider } = Layout;
  const { setAuthData } = useContext(authContext);
  const [booking, setBooking] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 10;
  const status = 2;
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectBooking, setSelectBooking] = useState(null);
  const [firstLetter, setFirstLetter] = useState("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const getToken = Cookies.get("authToken");
    if (getToken) {
      const decodedToken = JSON.parse(atob(getToken.split(".")[1]));
      console.log(decodedToken);
      const name = decodedToken.username;
      const firstLetter = name.charAt(0).toUpperCase();
      setFirstLetter(firstLetter);
      setAdminName(name);
    }
  }, [setFirstLetter, setAdminName]);

  const handleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://autofix-server.onrender.com/booking/all?currentPage=${currentPage}&limit=${postPerPage}&status=${status}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const filteredBookings = data.bookings.all.filter(
          (booking) => booking.status === 2
        );
        setTimeout(() => {
          setLoading(false);
          setBooking(filteredBookings);
          setTotalBookings(data.total.Bookings);
        }, 2000);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = () => {
    Cookies.remove("authToken");
    setAuthData(null);
    navigate("/admin");
  };

  useEffect(() => {
    handleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };


  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFinish = async (update) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://autofix-server.onrender.com/booking/all?currentPage=${currentPage}&limit=${postPerPage}`
      );
      if (response.ok) {
        console.log(update);
        const updateResponse = await fetch(
          `https://autofix-server.onrender.com/booking/all/${update}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: 3,
            }),
          }
        );
        if (updateResponse.ok) {
          const updatedBookings = booking.filter(
            (booking) => booking._id !== update
          );
          setLoading(false);
          setBooking(updatedBookings);
        }

        if (booking.length % postPerPage === 1 && currentPage > 1) {
          handlePagination(currentPage - 1);
        } else {
          handleData();
        }
      } else {
        console.log("Error");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const finishBooking = (record) => {
    setSelectBooking(record);
    setLoading(true);
    Modal.confirm({
      title: "Are you sure this booking has been finished?",
      icon: <ExclamationCircleOutlined />,
      content:
        "If agree, please choose OK to approved or Cancel if you change your mind.",
      onOk: () => {
        setLoading(false);
        handleFinish(record._id);
      },
      onCancel: () => {
        setLoading(false);
      },
    });
  };

  const items = [
    {
      label: <Link to="/panel">Bookings</Link>,
      icon: <OrderedListOutlined />,
      key: "panel",
    },
    {
      label: <Link to="/panel/processed">Processed</Link>,
      icon: <HistoryOutlined />,
      key: "processed",
    },
    {
      label: <Link to="/panel/cancel">Cancelled</Link>,
      icon: <CloseCircleOutlined />,
      key: "cancel",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) =>
        (currentPage - 1) * postPerPage + index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date, record) => formatDate(record.date),
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Not Approved" : "Approved"),
    },
    {
      title: "Booking Employee",
      dataIndex: ["employee_id", "employee_name"],
      key: "employee",
      render: (text, record) => record.employee_id[0].employee_name,
    },
    {
      title: "Username",
      dataIndex: ["user_id", "username"],
      key: "name",
      render: (text, record) => (record.user_id.length && record.user_id[0].username || record.user_google_id.length && record.user_google_id[0].name),
    },
    {
      title: "User Phone No",
      dataIndex: ["user_id", "phone"],
      key: "phone",
      render: (text, record) => {if (record.user_id.length && record.user_id[0].phone) {
        return record.user_id[0].phone;
      } else if (record.user_google_id.length && record.user_google_id[0].phone) {
        return record.user_google_id[0].phone;
      } else {
        return ""; 
      }},
    },
    {
      title: "Booking Hours",
      dataIndex: ["hours_id", "hours"],
      key: "hours",
      render: (text, record) => record.hours_id[0].hours,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => finishBooking(record)}><CheckOutlined/></Button>
        </div>
      ),
    },
  ];

  const confirmLogOut = () => {
    Modal.confirm({
      title: "Do you want to log out?",
      icon: <ExclamationCircleOutlined />,
      content: "If agree, please choose OK or Cancel if you change your mind.",
      onOk: () => {
        handleLogOut();
      },
      onCancel: () => {},
    });
  };
  const content = (
    <div>
      <Button
        style={{
          width: "100%",
          borderRadius: 120,
          height: 35,
          color: "white",
          fontSize: 15,
          backgroundColor: "#1677ff",
        }}
        onClick={confirmLogOut}
      >
        <LogoutOutlined /> Log Out
      </Button>
    </div>
  );
  return (
    <div className="booking-page">
      <Layout>
        <Sider
          style={{}}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {!collapsed && (
            <div style={{ marginTop: "20px", padding: "0 50px" }}>AUTOFIX</div>
          )}
          <Menu
            style={{ marginTop: "50px", marginBottom: "50px" }}
            theme="dark"
            defaultSelectedKeys={['processed']}
            mode="inline"
            items={items}
          ></Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "0 16px",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Breadcrumb
                style={{ width: "200px" }}
                items={[
                  { title: "User" },
                  {
                    title: (
                      <Tooltip title={adminName}>
                        <div
                          style={{
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {adminName}
                        </div>
                      </Tooltip>
                    ),
                  },
                ]}
              />

              <Popover
                content={content}
                title={
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    Manage Account
                  </span>
                }
              >
                <Button
                  style={{
                    width: "35px",
                    borderRadius: 120,
                    height: 35,
                    color: "white",
                    fontSize: 15,
                    backgroundColor: "#1677ff",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {firstLetter}
                </Button>
              </Popover>
            </div>
            <div
              style={{
                padding: 24,
                marginTop: "10px",
                boxSizing: "unset",
                minHeight: "90vh",
                background: colorBgContainer,
              }}
            >
              <div>
                <Table
                  columns={columns}
                  dataSource={booking}
                  rowKey={(record) => record._id}
                  pagination={false}
                  loading={loading}
                />
                {(currentPage !== 1 || booking.length > 1) && (
                  <Pagination
                    style={{ marginTop: 30 }}
                    defaultCurrent={1}
                    onChange={handlePagination}
                    total={totalBookings}
                    showQuickJumper
                    showSizeChanger={false}
                  />
                )}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default AdminProcessed;
