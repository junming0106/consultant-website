export default function Footer() {
  return (
    <footer className="bg-[#1a365d] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">企業顧問</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              專業的企業顧問服務，協助您的事業發展與轉型，
              打造競爭優勢，實現長遠成功。
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <i className="fa-brands fa-square-facebook"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Line</span>
                <i className="fa-brands fa-line"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Email</span>
                <i className="fa-solid fa-envelope"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Phone</span>
                <i className="fa-solid fa-mobile"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">服務項目</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  企業策略規劃
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  營運效率優化
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  市場拓展諮詢
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  組織架構重組
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">聯絡資訊</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <i className="fa-solid fa-phone"></i> +886 2 1234 5678
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i> contact@consultant.com
              </li>
              <li>
                <i className="fa-solid fa-location-dot"></i>
                台北市信義區信義路五段7號
              </li>
              <li>
                <i className="fa-solid fa-clock"></i> 週一至週五 9:00 - 18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 企業顧問. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
}
