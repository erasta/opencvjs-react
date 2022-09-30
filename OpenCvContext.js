import { createContext, useContext, useEffect, useState } from "react"

const opencvContext = createContext();

export const useOpencv = () => {
  return useContext(opencvContext);
}

export const OpencvProvider = ({ opencvVersion = '4.5.5', opencvPath = '', children }) => {
  const [theCV, setTheCV] = useState();

  useEffect(() => {
    const scriptId = 'opencv-react'
    if (document.getElementById(scriptId) || window.cv) {
      return
    }

    window.Module = window.Module || {
      wasmBinaryFile: 'opencv_js.wasm',
      usingWasm: true,
      onRuntimeInitialized: () => {
        console.log('opencv loaded', window.cv)
        setTheCV(window.cv);
      }
    }

    const scriptElement = document.createElement('script')
    scriptElement.id = scriptId
    scriptElement.nonce = true
    scriptElement.defer = true
    scriptElement.async = true
    scriptElement.src = ((opencvPath !== '') ? opencvPath : `https://docs.opencv.org/${opencvVersion}/opencv.js`);
    document.body.appendChild(scriptElement)
  }, [opencvPath])

  return (
    <opencvContext.Provider value={theCV}>
      {children}
    </opencvContext.Provider>
  )
}
