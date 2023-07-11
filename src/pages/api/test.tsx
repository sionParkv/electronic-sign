import type { NextApiRequest, NextApiResponse } from 'next'

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ code: 'OK' })
}

export default test
