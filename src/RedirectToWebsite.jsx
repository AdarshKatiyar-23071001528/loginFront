import React, { useEffect } from 'react';

const RedirectToWebsite = () => {
  useEffect(() => {
    window.location.replace("https://www.skitedu.in/");
  }, []);

  return null;
};

export default RedirectToWebsite;
