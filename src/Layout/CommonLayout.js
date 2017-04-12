import React from 'react';
import { Button, Icon, Input } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import styles from './CommonLayout.less';
import { isLocaleZhCN } from '../utils';
import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';

addLocaleData([...zhCN.data, ...enUS.data]);

class CommonLayout extends React.Component {
  state = {
    locale: isLocaleZhCN() ? 'zh-CN' : 'en-US',
  }
  handleLocaleChange = () => {
    const locale = this.state.locale === 'zh-CN' ? 'en-US' : 'zh-CN';
    localStorage.setItem('locale', locale);
    this.setState({ locale });
  }
  handleSearch = (e) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(e.target.value ? `/?search=${e.target.value}` : ''));
  }
  render() {
    const { dispatch, user, children, location: { pathname } } = this.props;
    const { locale } = this.state;
    const appLocale = locale === 'zh-CN' ? zhCN : enUS;
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <div>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>
                <Link to="/">Template</Link>
              </h1>
              <span className={styles.searchWrapper}>
                <Input
                  className={styles.search}
                  prefix={<Icon type="search" style={{ marginLeft: 10 }} />}
                  placeholder="Search here"
                  onChange={this.handleSearch}
                />
              </span>
              <div className={styles.right}>
                {user ? (
                  <span>
                    <Link className={styles.link} to="contribute">
                      <Icon type="plus-circle-o" />
                      <FormattedMessage id="submit" />
                    </Link>
                    <Link className={styles.link} to="help">
                      <Icon type="question-circle-o" />
                      <FormattedMessage id="help" />
                    </Link>
                    {!user.logining && (
                      <span>
                        <img alt="avatar" className={styles.avatar} src={user.avatar_url} />
                        {user.name}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    <Link className={styles.link} to="contribute">
                      <Icon type="plus-circle-o" />
                      <FormattedMessage id="submit" />
                    </Link>
                    <a onClick={() => dispatch({ type: 'auth/login' })}>
                      <Icon type="github" />
                      <FormattedMessage id="login" />
                    </a>
                  </span>
                )}
                <Button
                  className={styles.changeLocale}
                  onClick={this.handleLocaleChange}
                  size="small"
                >
                  {locale === 'zh-CN' ? 'EN' : '中文'}
                </Button>
              </div>
            </div>
          </header>
          {
            pathname === '/' ? (
              <div className={styles.banner} />
            ) : null
          }
          <div className={styles.container}>
            {children}
          </div>
        </div>
      </IntlProvider>
    );
  }
}

export default connect(props => ({
  user: props.auth.user,
}))(CommonLayout);
