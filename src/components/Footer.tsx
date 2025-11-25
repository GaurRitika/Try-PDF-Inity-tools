import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">PDF Tools</h3>
            <p className="text-sm text-muted-foreground">
              Free online PDF tools for all your document needs. Fast, secure, and no signup required.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/merge-pdf" className="text-muted-foreground hover:text-primary transition-base">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="text-muted-foreground hover:text-primary transition-base">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="text-muted-foreground hover:text-primary transition-base">
                  Split PDF
                </Link>
              </li>
              <li className="text-muted-foreground/50">PDF to Image (Coming Soon)</li>
              <li className="text-muted-foreground/50">Protect PDF (Coming Soon)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Popular Searches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Merge PDF online free</li>
              <li>Compress PDF online</li>
              <li>Split PDF online</li>
              <li>Combine PDF files</li>
              <li>Reduce PDF size</li>
              <li>PDF tools online free</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>100% Free Forever</li>
              <li>No File Size Limits</li>
              <li>Secure & Private</li>
              <li>No Watermarks</li>
              <li>Works on All Devices</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDF Tools Online. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keywords: pdf tools online, merge pdf, compress pdf, split pdf, extract pdf pages, pdf converter, 
            combine pdf, reduce pdf size, free pdf tools, online pdf editor, pdf joiner, pdf compressor, pdf splitter
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
