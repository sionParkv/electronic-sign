import type { NextApiRequest, NextApiResponse } from 'next'

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  res.send('API')
}

export default test
