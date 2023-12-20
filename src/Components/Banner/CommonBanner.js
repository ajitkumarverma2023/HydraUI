import { Banner } from '@optics/framework'
import { useState, useEffect } from 'react'
import { PropertyProvider } from '@optics/framework'
import { TranslatorProvider } from '@optics/framework'
import Menu from '../Banner/Navbar'
import { useLocation } from 'react-router-dom';
import SplitPanel from '../Dashboard/SplitPanel'

const currentDate = new Date();
const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
const formattedDate = currentDate.toLocaleDateString(undefined, options);

const BannerWithMokedUrlCmp = ({ setLoading, ...props }) => {
  const { propUrls, ...bannerProps } = props
  const [redraw] = useState(propUrls)
  const [sName, setsName] = useState();
const [resData, setResData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/getBanner', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          const getData = data['data']['system']['state']['hostname'];
          setsName(getData);
          setResData(data['data']['system']['aaa']['authentication']?.['users']['user']['username']);
          console.log("Login User : ", resData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);

      }
    };
    document.title = 'Dashboard';
    fetchData();
  }, [resData]);
  

  const translations = {
    alpha: sName,
    beta: ''
  }
  const BannerProperties = {
    sessionInfo: { userId: "Admin", fadList: ["Admin"] },
    userInfo: { almapOsprofiles: "Admin" },
    whatsNew: null,
    guiProperties: { displayBell: true },
    systemIps: null,
    globalVars: { Show_ESM: false, Show_WSO: true, Show_WSP: true, Show_NTSM: true }
  }
  const translator = k => translations[k]
  return (
    <>
      <PropertyProvider urls={redraw} props={BannerProperties}>
        <TranslatorProvider translator={translator}>
          <Banner
            {...bannerProps}
          />
        </TranslatorProvider>
      </PropertyProvider>
    </>
  )
}
function CommonBanner() {
  const location = useLocation();
  const { name } = location.state || {};
  const [flagFromMenu, setFlagFromMenu] = useState("false");
  const [menuData, setMenuData] = useState();
  
  console.log("bannerDetails data", name);
  return (
    <div>
      <BannerWithMokedUrlCmp product="alpha" title="beta" />

      <Menu setFlagFromMenu={setFlagFromMenu} setMenuData={setMenuData} />

      <SplitPanel menuData={menuData} flagFromMenu={flagFromMenu} setFlagFromMenu={setFlagFromMenu}/>

      {/* <CardSpace />   */}


      <footer style={{ backgroundColor: '#A9A9A9', padding: '10px', bottom: '0', width: '100%', position: 'fixed', }} >

      </footer>
      <h5 style={{ position: 'fixed', bottom: '-20px', right: '20px' }} >{formattedDate}</h5>


    </div>
  );
}

export default CommonBanner;
