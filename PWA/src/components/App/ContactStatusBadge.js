import React, {
    Component
  } from 'react';
  import {
    Badge
  } from 'reactstrap';
  import LoadingIcon from './LoadingIcon';
  import swal from 'sweetalert2';
  import PropTypes from 'prop-types';
  import shallowCompare from './Utilities';
  
  const propTypes = {
    dbObjectName: PropTypes.string.isRequired,
    dbId: PropTypes.string.isRequired,
    dbIdName: PropTypes.string.isRequired,
    dbActive: PropTypes.bool,
    authUserUid: PropTypes.string.isRequired,
    onSaveDbObject: PropTypes.func.isRequired,
    onChildUpdate: PropTypes.func.isRequired,
    activeOverrideColor: PropTypes.string,
    activeOverrideText: PropTypes.string,
    inActiveOverrideColor: PropTypes.string,
    inActiveOverrideText: PropTypes.string
  },
    defaultProps = {};
  
  class ContactStatusBadge extends Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
      this.state = {
        isLoading: true,
        dbActive: false
      };
    }
    componentDidMount = () => {
      this._isMounted = true;
      const {
        dbActive
      } = this.props;
      this.setState({
        isLoading: false,
        dbActive: dbActive
      });
    }
    shouldComponentUpdate = (nextProps, nextState) => {
      const shallowCompared = shallowCompare(this, nextProps, nextState, false);
      // console.log(`StatusBadge.shouldComponentUpdate: ${shallowCompared}`);
      return shallowCompared;
    }
    componentDidUpdate = async prevProps => {
      const {
        dbActive
      } = this.props;
      if (dbActive !== prevProps.dbActive) {
        this.setState({
          dbActive: dbActive
        });
      }
    }
    componentWillUnmount = () => {
      this._isMounted = false;
    }
    handleOnClick = async e => {
      e.preventDefault();
      e.stopPropagation();
      if (!this._isMounted) return;
      this.setState({
        isLoading: true
      });
      const dbObject = {
        active: !this.state.dbActive,
        uid: this.props.authUserUid
      };
      dbObject[this.props.dbIdName] = this.props.dbId;
      await this.props.onSaveDbObject(dbObject, this.handleOnClickComplete);
    }
    handleOnClickComplete = async error => {
      let icon = 'error',
        title = `Save ${this.props.dbObjectName}`,
        text = null;
      if (error) {
        text = typeof error.getMessage === 'function'
          ? error.getMessage()
          : error;
        console.log(`${title} Error: ${text}`);
        swal.fire({
          icon: icon,
          title: title,
          text: text
        });
        if (!this._isMounted) return;
        this.setState({
          isLoading: false
        });
      } else {
        const active = !this.state.dbActive;
        this.props.onChildUpdate({
          dbId: this.props.dbId,
          dbActive: active
        });
        if (!this._isMounted) return;
        this.setState({
          isLoading: false,
          dbActive: active
        });
      }
    }
    render = () => {
      const {
        dbId,
        statusBadgeClassName,
        activeOverrideColor,
        activeOverrideText,
        inActiveOverrideColor,
        inActiveOverrideText
      } = this.props,
      {
        isLoading,
        dbActive
      } = this.state,
        statusBadgeId = `statusBadge_${dbId}`;
      let statusBadgeColor = null,
        statusBadgeText = null;
      switch (!dbActive) {
        case true:
          statusBadgeColor = inActiveOverrideColor || 'secondary';
          statusBadgeText = inActiveOverrideText || 'Read';
          break;
        default:
          statusBadgeColor = activeOverrideColor || 'primary';
          statusBadgeText = activeOverrideText || 'Un-seen';
      }
      return (
        <>
          {
            isLoading
              ? <LoadingIcon size="sm" />
              : <>
                <Badge
                  id={statusBadgeId}
                  onClick={this.handleOnClick}
                  className={statusBadgeClassName || 'clickable'}
                  color={statusBadgeColor}
                  title="Click to change"
                  pill>
                  {statusBadgeText}
                </Badge>
              </>
          }
        </>
      );
    }
  }
  
  ContactStatusBadge.propTypes = propTypes;
  ContactStatusBadge.defaultProps = defaultProps;
  
  export default ContactStatusBadge;