import { Rate, Button, Avatar, Spin, Input } from "antd";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
function RatingForm({ employeeID, onRatingSubmit,  avatar , employeeName , bookingId }) {
  // eslint-disable-next-line no-unused-vars
  const [isloading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSpin , setIsSpin] = useState(true);
  console.log(bookingId);
  useEffect(() => {
    const time= setTimeout(() => {
      setIsSpin(false);
    }, 3000)

    return (() => clearTimeout(time))
  },[])

  useEffect(() => {
    console.log(rating);
  }, [rating]);

  const updateRating = async () => {
    try {
      setIsLoading(true);
      if (!employeeID || !rating ) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3000/employee/all/${employeeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: rating,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const statusRating = await fetch(`http://localhost:3000/booking/all/${bookingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRating:true
          })
        })
        if(statusRating.ok) {
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
          if (onRatingSubmit) {
            onRatingSubmit();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
    <div style={{display:'flex' , justifyContent:'center'}}>
    
      <Avatar style={{ height: 65, width: 65 }} src={avatar} />
      {isSpin && <div style={{width:70, height:70, position: 'absolute',  display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}>
      <Spin/>
      </div>}
    </div>
    <div style={{display: 'flex', justifyContent:'center'}}>{employeeName}</div>
      <Rate
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        allowHalf
        onChange={(value) => {
          console.log(value);
          setRating(value);
        }}
      />
      <div >
        <div>Reviews</div>
      </div>
      <Input.TextArea style={{ height: 100 }} placeholder="Basic usage" showCount={true} maxLength={300}/>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
      >
        <Button type="primary" onClick={updateRating} >
          Submit
        </Button>
      </div>
    </>
  );
}

export default RatingForm;
