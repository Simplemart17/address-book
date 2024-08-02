import { Container } from '@/components/Container'
import { DiamondIcon } from './DiamondIcon'

export function Footer():JSX.Element {
  return (
    <footer className="flex pt-6 pb-3 mt-10 bg-gray-700">
      <Container className="flex flex-col items-center justify-center md:flex-row">
        <div className="flex justify-center items-center">
          <p className="text-base text-slate-400">Copyright &copy; {new Date().getFullYear()}</p>
          <DiamondIcon className="ml-5 h-1.5 w-1.5 overflow-visible fill-blue-400 stroke-blue-400" />
          <p className="ml-2 text-slate-400">Made by Martins Aloba</p>
        </div>
      </Container>
    </footer>
  )
}
