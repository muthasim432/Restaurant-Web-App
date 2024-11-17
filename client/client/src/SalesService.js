import axios from 'axios';

class SalesService {
  static async getSalesData() {
    const response = await axios.get('http://localhost:5000/sales');
    return response.data;
  }
}

export default SalesService;
