import { Container } from '@/components/Container'
import { DiamondIcon } from './DiamondIcon'

export function Footer():JSX.Element {
  return (
    <footer className="flex-none py-16 bg-gray-700">
      <Container className="flex flex-col items-center justify-center md:flex-row">
        <div className="flex justify-center items-center">
          <p className="mt-6 text-base text-slate-500 md:mt-0">Copyright &copy; {new Date().getFullYear()}</p>
          <DiamondIcon className="ml-5 h-1.5 w-1.5 overflow-visible fill-blue-400 stroke-blue-400" />
          <p className="ml-2 text-slate-500">Made by Group 8</p>
        </div>
      </Container>
    </footer>
  )
}
