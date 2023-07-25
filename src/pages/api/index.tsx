import type { NextApiRequest, NextApiResponse } from 'next'

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  res.send('API')
}

export default api
