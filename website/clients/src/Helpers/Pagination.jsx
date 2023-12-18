import { Button  } from "antd";
//import {DoubleLeftOutlined, DoubleRightOutlined} from '@ant-design/icons'
// eslint-disable-next-line react/prop-types
const Paging = ({ postPerPage, length, handlePagination }) => {
  const paginationNumber = [];

  for (let i = 1; i <= Math.ceil(length / postPerPage); i++) {
    paginationNumber.push(i);
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}>
      {paginationNumber.map((pageNumber, index) => (
        <div key={index}>
          <Button
            style={{ marginLeft: 5 }}
            key={pageNumber}
            onClick={() => handlePagination(pageNumber)}
          >
            {pageNumber}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Paging;
