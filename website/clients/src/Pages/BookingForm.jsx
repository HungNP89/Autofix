/* eslint-disable react/prop-types */
import {
  Space,
  Button,
  Avatar,
  Rate,
  Spin,
  Tooltip,
  Modal,
  message,
} from "antd";
import "../Design/BookingForm.css";
import { useEffect, useState } from "react";
import {  ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function BookingForm({ selectedDate, userId }) {
  const [activeButton, setActiveButton] = useState(null);
  const [activeMechanic, setActiveMechanic] = useState(null);
  const [hours, setHours] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [selectHour, setSelectHour] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [buttonDisable, setButtonDisable] = useState([]);
  const formmattedDate = selectedDate.format("DD-MM-YYYY");
  const navigate = useNavigate();

  const getHourData = async () => {
    const date = selectedDate.format("YYYY-MM-DD");
    try {
      const response = await fetch(
        `http://localhost:3000/hour/shifts?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        const { hours, unAvailableHours } = data;

        const disableArray = hours.map((hour) => {
          const unAvailableHour = unAvailableHours.find(
            (item) => item.hourId === hour._id
          );
          //console.log(unAvailableHour)
          return unAvailableHour ? unAvailableHour.unAvailable : false;
        });
        setButtonDisable(disableArray);
        console.log(disableArray);
        setHours(hours);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHourData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentHour = dayjs().format("H.m");
  const currentDate = dayjs().format("YYYY-MM-DD");

  const handleClick = async (buttonIndex) => {
    setActiveButton(buttonIndex);
    setSelectHour(hours[buttonIndex]);

    const selectedHour = hours[buttonIndex]._id;
    const date = selectedDate.format("YYYY-MM-DD");
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/employee/all?date=${date}&hour=${selectedHour}`
      );
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setEmployees(data);
          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleMechanicClick = (mechanicIndex) => {
    setActiveMechanic(mechanicIndex);
    setSelectedEmployee(employees[mechanicIndex]);
  };

  const handleSubmit = async () => {
    const selectedHour = hours[activeButton]._id;
    const date = selectedDate.format("YYYY-MM-DD");
    const selectedEmployee = employees[activeMechanic]._id;

    try {
      const response = await fetch(`http://localhost:3000/booking/createP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          user_google_id: userId,
          employee_id: selectedEmployee,
          hours_id: selectedHour,
          date: date,
          status: 1,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        success();
        setTimeout(() => {
          navigate("/main/detail");
        }, 2000);
      } else {
        console.log("Submit failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Your booking is now sending to admin to confirm",
      duration: 2,
    });
  };
  const fail = () => {
    messageApi.open({
      type: "error",
      content: "You cancel your booking",
      duration: 2,
    });
  };

  const notify = () => {
    messageApi.open({
      type: "warning",
      content: "Please select hours and mechanic before submitting",
      duration: 2,
    });
  };
  const confirmBooking = () => {
    Modal.confirm({
      title: "Are you sure you want to book?",
      icon: <ExclamationCircleOutlined />,
      content:
        "If agree, please choose OK to confirm your booking or Cancel if you change your mind.",
      onOk: () => {
        handleSubmit();
        if (selectHour === null || selectedEmployee === null) {
          notify();
        }
      },
      onCancel: () => {
        fail();
      },
    });
  };

  return (
    <>
    <div>
      {contextHolder}
      <div style={{display:'flex' , justifyContent: 'center', fontSize:17}}>{formmattedDate}</div>
      <div className="content1">
      <div style={{ marginBottom: "10px", fontSize: 20 }}>Time</div>
      <div className="content2">
        <div className="btn1"></div>
        <div>: Disabled Hour /</div>
        <div className="btn3"></div>
        <div>: Available Hour</div>
      </div>
      </div>
      <div className="form">
        {hours.map((hour, index) => {
          const startTime = parseInt(hour.hours.split("-")[0], 10);
          const isDisabledButton =
            buttonDisable[index] ||
            (selectedDate.format("YYYY-MM-DD") === currentDate &&
              startTime < currentHour);

          return (
            <div key={index}>
              <Button
                onClick={() => handleClick(index)}
                style={{
                  backgroundColor: activeButton === index ? "#73c2fb" : "#1677ff",
                  color: activeButton === index ? "black" : "white",
                }}
                disabled={isDisabledButton}
              >
                {hour.hours}
              </Button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          marginTop: 20,
        }}
      >
        <div style={{ marginBottom: "10px" }}>Mechanic</div>
        <div style={{ marginRight: 300 }}> Please choose the time first</div>
      </div>
      {isloading ? (
        <div style={{display: 'flex' , justifyContent: 'center' , marginTop: 20}}>
          <Spin/>
        </div> 
      ) : (
        <div
          className="form-mechanic"
          style={{ overflowY: "scroll", maxHeight: "40vh" , marginRight: 10 }}
        >
          {employees.map((employee, index) => {
            return (
              <Space key={index}>
                <Button
                  onClick={() => handleMechanicClick(index)}
                  style={{
                    backgroundColor:
                      activeMechanic === index ? "#1677ff" : "white",
                    color: activeMechanic === index ? "white" : "black",
                    height: 85,
                    width: 320,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      style={{ height: 65, width: 65, flex: 0.4 }}
                      src={employee.avatar}
                      loading="lazy"
                    />
                    
                    <div
                      style={{ flex: 1.6, marginBottom: 10, marginLeft: 10 }}
                    >
                      <Tooltip title={employee.employee_name}>
                        <p
                          style={{
                            maxWidth: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginLeft: 50,
                          }}
                        >
                          {`${employee.employee_name} (${employee.totalRating})`}
                        </p>
                      </Tooltip>
                      <Rate defaultValue={employee.rating} disabled allowHalf />
                    </div>
                  </div>
                </Button>
              </Space>
            );
          })}
          
        </div>
      )}
    </div>
    <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
      >
        <Button type='primary' onClick={confirmBooking}>Submit</Button>
      </div>
    </>
  );
}

export default BookingForm;
