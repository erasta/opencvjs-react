import { createContext, useContext, useEffect, useState } from "react"

const OpenCvContext = createContext()

export const useOpenCv = () => {
  return useContext(OpenCvContext);
}

export const OpenCvProvider = ({ children }) => {
  const [theCV, setTheCV] = useState();
  const openCvPath = './opencv.js';

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
    scriptElement.src = openCvPath || 'https://docs.opencv.org/3.4.13/opencv.js'
    scriptElement.nonce = true
    scriptElement.defer = true
    scriptElement.async = true
    document.body.appendChild(scriptElement)
  }, [openCvPath])

  return <OpenCvContext.Provider value={theCV}>{children}</OpenCvContext.Provider>
}
