import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";
import {
  BootstrapTable,
  TableHeaderColumn
} from 'react-bootstrap-table';
import FirebaseImage from '../../components/App/FirebaseImage';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import csvImage from "../../assets/img/tkot/File Type Images/csv-image.png"
import docImage from "../../assets/img/tkot/File Type Images/doc-image.png"
import powerpointImage from "../../assets/img/tkot/File Type Images/powerpoint-image.png"
import txtImage from "../../assets/img/tkot/File Type Images/txt-image.png"
import videoImage from "../../assets/img/tkot/File Type Images/video-image.jpg"


const AuthResourceDriveView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileArray, setFileArray] = useState([]);

  const KB = "KB";
  const MB = "MB";
  const GB = "GB";

  useEffect(() => {
      const fileArray = [
        { 
          googleDriveFileName: "Jet Report",
          googleDriveFileType: "csv",
          googleDriveFileSize: "100" + KB,
          googleDriveFileOwner: "Israel",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: csvImage
        },
        {
          googleDriveFileName: "Accounting",
          googleDriveFileType: "csv",
          googleDriveFileSize: "250" + KB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "1/04/2020",
          photoURL: csvImage
          
        },
        {
          googleDriveFileName: "Toy Story",
          googleDriveFileType: "avi",
          googleDriveFileSize: "1.5" + GB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: videoImage
          
        },
        {
          googleDriveFileName: "Top 10 ways to run",
          googleDriveFileType: "txt",
          googleDriveFileSize: "15" + KB,
          googleDriveFileOwner: "Krisharn",
          googleDriveFileLastModified: "09/03/2020",
          photoURL: txtImage
          
        },
        {
          googleDriveFileName: "Our Website Slide Show",
          googleDriveFileType: "ppt",
          googleDriveFileSize: "2.5" + MB,
          googleDriveFileOwner: "Peke",
          googleDriveFileLastModified: "15/02/2020",
          photoURL: powerpointImage
          
        },
        {
          googleDriveFileName: "Top 10 Programming Languages",
          googleDriveFileType: "doc",
          googleDriveFileSize: "3" + MB,
          googleDriveFileOwner: "Indigo",
          googleDriveFileLastModified: "22/04/2020",
          photoURL: docImage
        },
        { 
          googleDriveFileName: "Jet Report",
          googleDriveFileType: "csv",
          googleDriveFileSize: "100" + KB,
          googleDriveFileOwner: "Israel",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: csvImage
        },
        {
          googleDriveFileName: "Accounting",
          googleDriveFileType: "csv",
          googleDriveFileSize: "250" + KB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "1/04/2020",
          photoURL: csvImage
          
        },
        {
          googleDriveFileName: "Toy Story",
          googleDriveFileType: "avi",
          googleDriveFileSize: "1.5" + GB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: videoImage
          
        },
        {
          googleDriveFileName: "Top 10 ways to run",
          googleDriveFileType: "txt",
          googleDriveFileSize: "15" + KB,
          googleDriveFileOwner: "Krisharn",
          googleDriveFileLastModified: "09/03/2020",
          photoURL: txtImage
          
        },
        {
          googleDriveFileName: "Our Website Slide Show",
          googleDriveFileType: "ppt",
          googleDriveFileSize: "2.5" + MB,
          googleDriveFileOwner: "Peke",
          googleDriveFileLastModified: "15/02/2020",
          photoURL: powerpointImage
          
        },
        {
          googleDriveFileName: "Top 10 Programming Languages",
          googleDriveFileType: "doc",
          googleDriveFileSize: "3" + MB,
          googleDriveFileOwner: "Indigo",
          googleDriveFileLastModified: "22/04/2020",
          photoURL: docImage
        },
        { 
          googleDriveFileName: "Jet Report",
          googleDriveFileType: "csv",
          googleDriveFileSize: "100" + KB,
          googleDriveFileOwner: "Israel",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: csvImage
        },
        {
          googleDriveFileName: "Accounting",
          googleDriveFileType: "csv",
          googleDriveFileSize: "250" + KB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "1/04/2020",
          photoURL: csvImage
          
        },
        {
          googleDriveFileName: "Toy Story",
          googleDriveFileType: "avi",
          googleDriveFileSize: "1.5" + GB,
          googleDriveFileOwner: "John",
          googleDriveFileLastModified: "12/02/2019",
          photoURL: videoImage
          
        },
        {
          googleDriveFileName: "Top 10 ways to run",
          googleDriveFileType: "txt",
          googleDriveFileSize: "15" + KB,
          googleDriveFileOwner: "Krisharn",
          googleDriveFileLastModified: "09/03/2020",
          photoURL: txtImage
          
        },
        {
          googleDriveFileName: "Our Website Slide Show",
          googleDriveFileType: "ppt",
          googleDriveFileSize: "2.5" + MB,
          googleDriveFileOwner: "Peke",
          googleDriveFileLastModified: "15/02/2020",
          photoURL: powerpointImage
          
        },
        {
          googleDriveFileName: "Top 10 Programming Languages",
          googleDriveFileType: "doc",
          googleDriveFileSize: "3" + MB,
          googleDriveFileOwner: "Indigo",
          googleDriveFileLastModified: "22/04/2020",
          photoURL: docImage
        },
      ];
      setFileArray(fileArray);
      setIsLoading(false);
  },[]);

  const handleSortChange = async (sortName, sortOrder) => {
    fileArray.sort((a, b) => {
      let aValue = a[sortName],
        bValue = b[sortName];
      if (sortName === 'providerData') {
        aValue = Object.keys(aValue).map(k => aValue[k])[0].providerId;
        bValue = Object.keys(bValue).map(k => bValue[k])[0].providerId;
      }
      if (sortName === 'roles') {
        aValue = Object.keys(aValue).map(k => aValue[k])[0];
        bValue = Object.keys(bValue).map(k => bValue[k])[0];
      }
      return (
        (aValue > bValue)
          ? (sortOrder === 'asc')
            ? 1
            : -1
          : (bValue > aValue)
            ? (sortOrder === 'asc')
              ? -1
              : 1
            : 0
      );
    });
    setIsLoading(false);
  }
  return (
    <Container className="content mt-5">
      <Row>
          <Col>
            <Card>
              <CardBody>
                {
                  isLoading
                  ? <LoadingOverlayModal />
                  : <BootstrapTable data={fileArray} version="4" bordered={false} condensed hover
                          tableHeaderClass="text-primary"
                          exportCSV csvFileName="user-table-export.csv"
                          search pagination options={{
                            defaultSortName: 'displayName',
                            hideSizePerPage: true,
                            noDataText: 'No Files found.',
                            onSortChange: handleSortChange
                          }}>
                          <TableHeaderColumn dataField="photoURL" dataSort width="45px" dataFormat={(cell, row) => (
                            <FirebaseImage
                              imageResize="sm"
                              loadingIconSize="sm"
                              alt= 'File Image'
                              imageURL={cell}
                            />
                          )}>{' '}</TableHeaderColumn>
                          <TableHeaderColumn isKey dataField="googleDriveFileName" dataSort width="327px">Name</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileType" dataSort width="327px">Type</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileSize" dataSort width="327px">Size</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileOwner" dataSort width="327px">Owner</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileLastModified" dataSort width="327px">Last Modified</TableHeaderColumn>
                        </BootstrapTable>
                  }
              </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AuthResourceDriveView
