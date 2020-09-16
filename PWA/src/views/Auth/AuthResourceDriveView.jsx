import React, {
  useState,
  useEffect
} from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Row
} from "reactstrap";
import {
  BootstrapTable,
  TableHeaderColumn
} from 'react-bootstrap-table';
import FirebaseImage from 'components/App/FirebaseImage';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import csvImage from "../../assets/img/tkot/File Type Images/csv-image.png";
import docImage from "../../assets/img/tkot/File Type Images/doc-image.png";
import powerpointImage from "../../assets/img/tkot/File Type Images/powerpoint-image.png";
import txtImage from "../../assets/img/tkot/File Type Images/txt-image.png";
import videoImage from "../../assets/img/tkot/File Type Images/video-image.jpg";
import {
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthResourceDriveView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileArray, setFileArray] = useState([]);
  const [rowID, setRowID] = useState([false]);
  const [deleteArray, setDeleteArray] = useState([]);
  const KB = "KB";
  const MB = "MB";
  const GB = "GB";

  const getRid = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  const userExists = (googleDriveFileName) => {
    return fileArray.some(function(array) {
      return array.googleDriveFileName === googleDriveFileName;
    }); 
  }
  
  useEffect( () => {
      var fileArray = [
          {
            rid: getRid(),
            googleDriveFileName: "Jet Report",
            googleDriveFileType: "csv",
            googleDriveFileSize: "100" + KB,
            googleDriveFileOwner: "Israel",
            googleDriveFileLastModified: "12/02/2019",
            photoURL: csvImage
          },
          {
            rid: getRid(),
            googleDriveFileName: "Accounting",
            googleDriveFileType: "csv",
            googleDriveFileSize: "250" + KB,
            googleDriveFileOwner: "John",
            googleDriveFileLastModified: "1/04/2020",
            photoURL: csvImage
          },
          {
            rid: getRid(),
            googleDriveFileName: "Toy Story",
            googleDriveFileType: "avi",
            googleDriveFileSize: "1.5" + GB,
            googleDriveFileOwner: "John",
            googleDriveFileLastModified: "12/02/2019",
            photoURL: videoImage
          },
          {
            rid: getRid(),
            googleDriveFileName: "Top 10 ways to run",
            googleDriveFileType: "txt",
            googleDriveFileSize: "15" + KB,
            googleDriveFileOwner: "Krisharn",
            googleDriveFileLastModified: "09/03/2020",
            photoURL: txtImage
          },
          {
            rid: getRid(),
            googleDriveFileName: "Our Website Slide Show",
            googleDriveFileType: "ppt",
            googleDriveFileSize: "2.5" + MB,
            googleDriveFileOwner: "Peke",
            googleDriveFileLastModified: "15/02/2020",
            photoURL: powerpointImage
            
          },
          {
            rid: getRid(),
            googleDriveFileName: "Top 10 Programming Languages",
            googleDriveFileType: "doc",
            googleDriveFileSize: "3" + MB,
            googleDriveFileOwner: "Indigo",
            googleDriveFileLastModified: "22/04/2020",
            photoURL: docImage
          }
        ];
      sortArray(fileArray, 'googleDriveFileName', 'asc');
      setFileArray(fileArray);
      setIsLoading(false);
  },[]);
  
  const handleSortChange = async (sortName, sortOrder) => {
    sortArray(fileArray, sortName, sortOrder);
    setIsLoading(false);
  }
  const onRowSelect = (row, isSelected, e) => {
    let rowStr = '';
    let stringifyRow = '';
    for (const prop in row) {
      rowStr += prop + ': "' + row[prop] + '"';
      stringifyRow = JSON.stringify(row.googleDriveFileName);
    }
    if (isSelected) {
      deleteArray.push(row.rid);
      setDeleteArray(deleteArray);
      // alert(`is selected: ${isSelected}, deleteArray: ${JSON.stringify(deleteArray, null, 2)}`);
    } else {
      const newDeleteArray = deleteArray.filter(rid => {
        // console.log(`itemRid: ${item} rowRid: ${row.rid}`);
        return rid !== row.rid;
      });
      setDeleteArray(newDeleteArray);
      // alert(`is selected: ${isSelected}, deleteArray: ${JSON.stringify(deleteArray, null, 2)} newDeleteArray: ${JSON.stringify(newDeleteArray, null, 2)}`);
    }
 
      console.log(`row: ${stringifyRow}`);
    if (isSelected === false){
      setRowID(rowID - rowStr);
    } else if (isSelected === true) {
      setRowID(rowID + rowStr);
    }
  }
  
  const onSelectAll = (isSelected, rows) => {
    // alert(`is select all: ${isSelected}`);
    if (isSelected) {
      alert('Current display and selected data: ');
    } 
    else {
      alert('unselect rows: ');
    }
    for (let i = 0; i < rows.length; i++) {
      alert(rows[i].googleDriveFileName);
    }
  }

  const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: onRowSelect,
    onSelectAll: onSelectAll,
    bgColor: function(isSelect) {
      if (isSelect) {
        return 'yellow';
      }
      return null;
    }
  };
  
  const deleteButton = () => {
    try {
      deleteArray.map(rid => {
        const item = fileArray.find(item => item.rid === rid);
        const index = fileArray.indexOf(item);
        if (index > -1) {
          fileArray.splice(index, 1);
        }
        return null
      })
      alert("Deleted");
      alert("Update Table by clicking a row")
    } 
    catch (error){
      alert(error)
    }
  }
  const downloadButton = async () => {
    alert("TODO");
    // alert(`Row ID: ${rowID}`);
    // await downloadFunction(googleDriveFileName);
  }
  const handleUpload = (event) => {
    try {
      const files = event.target.files;
      const fileNameWithExt = files[0].name;
      const fileSize = files[0].size;
      const fileName = files[0].name.split('.').slice(0, -1).join('.');
      const fileExt = fileNameWithExt.substr(fileNameWithExt.lastIndexOf(".") + 1);
      var photoURL = "";
      var currentDate = new Date();
      const dd = String(currentDate.getDate()).padStart(2, '0');
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); 
      const yyyy = currentDate.getFullYear();
      currentDate = mm + '/' + dd + '/' + yyyy;
      const convertedSize = formatBytes(fileSize)
      const changedPhotoURL = photoSelector(fileExt, photoURL)
      // alert(userExists(fileName));           //check if name is not unique 
      if (changedPhotoURL) {
        // alert(`Name: ${fileName}`);
        // alert(`Date Updated/Modified: ${currentDate}`);
        // alert(`Type: ${fileExt}`);
        // alert(`Size: ${convertedSize}`);
        // alert(`changedPhotoURL: ${changedPhotoURL}`);
       if (userExists(fileName)) {
         alert(`That is a duplicate Name 'copy' will be added to the end of ${fileName}`)
         fileArray.push(
          { 
            googleDriveFileName: `${fileName} Copy`,
            googleDriveFileType: fileExt,
            googleDriveFileSize: convertedSize,
            googleDriveFileOwner: "Local",
            googleDriveFileLastModified: currentDate,
            photoURL: changedPhotoURL
          });
       }
        else {
          fileArray.push(
            { 
              googleDriveFileName: fileName,
              googleDriveFileType: fileExt,
              googleDriveFileSize: convertedSize,
              googleDriveFileOwner: "Local",
              googleDriveFileLastModified: currentDate,
              photoURL: changedPhotoURL
            });
          alert("File Added");
          alert("Update Table by clicking a row")
        }
      } 
      else {
        alert("That file is not accepted");
      }
    } 
    catch (error) {
      return
    }
  }
  
  // matches photo with file extension
  const photoSelector = (fileExt, photoURL) => {
    if (fileExt === "jpg") {
        return photoURL = txtImage;
    } else if (fileExt === "png") {
        return photoURL = txtImage;
    } else if (fileExt === "mp3") {
       return photoURL =  videoImage;
    }else if (fileExt === "csv") {
        return photoURL = csvImage;
    } else if (fileExt === "mp4") {
        return photoURL = videoImage;
    } else if (fileExt === "doc") {
        return photoURL = docImage;
    } else if (fileExt === "ppt") {
        return photoURL = powerpointImage;
    } else {
        return photoURL = null;
    }
  }
  // file size translator
  const formatBytes = (fileSize) => {
    var marker = 1024; 
    var decimal = 3; 
    var kiloBytes = marker; 
    var megaBytes = marker * marker; 
    var gigaBytes = marker * marker * marker; 
    if(fileSize < kiloBytes) return fileSize + " Bytes";
    else if(fileSize < megaBytes) return(fileSize / kiloBytes).toFixed(decimal) + KB;
    else if(fileSize < gigaBytes) return(fileSize / megaBytes).toFixed(decimal) + MB;
    else return(fileSize / gigaBytes).toFixed(decimal) + GB;
  }
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        <Row>
          <Col>
            <Card>
            <Input type="file" onChange ={handleUpload}/>
            <Button onClick={() => downloadButton()}>Download</Button>
            <Button onClick={() => deleteButton()}>Delete</Button>
              <CardBody>
                {
                  isLoading
                  ? <LoadingOverlayModal color="text-muted" />
                  : <BootstrapTable data={fileArray} version="4" bordered={false} condensed hover
                          tableHeaderClass="text-primary"
                          exportCSV csvFileName="file-table-export.csv"
                          selectRow={ selectRowProp }
                          search pagination options={{
                            hideSizePerPage: true,
                            noDataText: 'No Files found.',
                            onSortChange: handleSortChange
                          }}>
                          <TableHeaderColumn dataField="photoURL" dataSort caretRender={renderCaret} width="45px" dataFormat={(cell, row) => (
                            <FirebaseImage
                              loadingIconSize="sm"
                              alt= 'File Image'
                              imageURL={cell}
                            />
                          )}>{' '}</TableHeaderColumn>
                          <TableHeaderColumn isKey dataField="googleDriveFileName" dataSort caretRender={renderCaret} width="327px">Name</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileType" dataSort caretRender={renderCaret} width="327px">Type</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileSize" dataSort caretRender={renderCaret} width="327px">Size</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileOwner" dataSort caretRender={renderCaret} width="327px">Owner</TableHeaderColumn>
                          <TableHeaderColumn dataField="googleDriveFileLastModified" dataSort caretRender={renderCaret} width="327px">Last Modified</TableHeaderColumn>
                          <TableHeaderColumn hidden dataField="rid" dataSort caretRender={renderCaret}>rid</TableHeaderColumn>
                        </BootstrapTable>
                  }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AuthResourceDriveView
